/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import OrderModel from "../../schema/order.model";
import ProductModel from "../../schema/product.model";
import ProvinceModel from '../../schema/province.model';

import colors from "colors";
import { parseISOToString } from "../../helpers/date.helper";
import { ERROR_CODE, SCAN_REDIS_KEY_TYPE, EXPIRES_TIME_CHANGE } from "../../constants";
import errorMessage from "../../util/error";
import * as RedisClient from '../../util/Redis';

import { scanService } from '../redisStore/redisStore.service';
import mongoose from 'mongoose';
import moment from "moment";

export async function newOrderService(
  orderItems,
  shippingInfo,
  itemsPrice,
  taxPrice,
  shippingPrice,
  totalPrice,
  paymentInfo,
  id
) {
  try {
    const dateNow = parseISOToString();
    const order = await OrderModel.create({
      orderItems,
      shippingInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentInfo,
      paidAt: dateNow,
      user: id,
    });
    
    orderItems.forEach(async (item) => {
      await updateStockService(item.product, item.quantity);
    });

    return order;
  } catch (error) {
    console.log(colors.red(`newOrderService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function getSingleOrderService(id) {
  try {
    const order = await OrderModel.findById(id).populate("user", "name email");

    if (!order)
      return errorMessage(404, "Lỗi, không tìm thấy đơn đặt hàng với id này!");

    return order;
  } catch (error) {
    console.log(colors.red(`getSingleOrderService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function myOrdersService(id) {
  try {
    const orders = await OrderModel.find({ user: id });

    return orders;
  } catch (error) {
    console.log(colors.red(`getSingleOrderService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function allOrdersService() {
  try {
    const orders = await OrderModel.find();
    let total = 0;

    orders.forEach((order) => {
      total += order.totalPrice;
    });

    const payload = {
      total,
      orders,
    };

    return payload;
  } catch (error) {
    console.log(colors.red(`getSingleOrderService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function updateOrderService(id, orderStatus) {
  try {
    const dateNow = parseISOToString();
    const order = await OrderModel.findById(id);

    if (order.orderStatus === "Đã giao")
      return errorMessage(400, "Lỗi, đơn hàng này đã được giao");

    if (orderStatus === "Hủy")
      order.orderItems.forEach(async (item) => {
        await updateStockService(item.product, - item.quantity);
      });

    order.orderStatus = orderStatus;
    order.delivereddAt = dateNow;

    await order.save();

    return true;
  } catch (error) {
    console.log(colors.red(`updateOrderService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function updateStockService(id, quantity) {
  try {
    const product = await ProductModel.findById(id);

    product.stock = product.stock - quantity;

    await product.save({ validateBeforeSave: false });
  } catch (error) {
    console.log(colors.red(`updateStockService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function deleteOrderService(id) {
  try {
    const order = await OrderModel.findById(id);

    const keyExpiresTime = 30 * EXPIRES_TIME_CHANGE;
    const deleteKey = `DELETED_ORDER_${order._id}_${order.user}_${order.paymentInfo?.id}_${order.totalPrice}_${order.orderStatus}`;
    await RedisClient.setTextByKey(
      deleteKey,
      keyExpiresTime,
      JSON.stringify(order)
    );

    if (!order)
      return errorMessage(404, "Lỗi, không tìm thấy đơn đặt hàng với id này!");

    await order.deleteOne();

    return true;
  } catch (error) {
    console.log(colors.red(`getSingleOrderService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function getLocationsService(province, district) {
  try {
    const payload = {};

    const provincesInfo = await ProvinceModel.find().lean();

    if (!province && !district) { 
      const provinces = provincesInfo.map((item) => item?.name);
      payload.provinces = provinces.sort();
    } else if (province) {
      let districtsInfo = [];
      for (const provinceInfo of provincesInfo) {
        if (provinceInfo?.name === province) {
          districtsInfo = provinceInfo.districts;
          break;
        }
      }

      if (!district) {
        const districts = districtsInfo.map((item) => item?.name);
        payload.districts = districts.sort();
      } else {
        let wardsInfo = [];
        for (const districtInfo of districtsInfo) {
          if (districtInfo?.name === district) {
            wardsInfo = districtInfo.wards;
            break;
          }
        }
        const wards = wardsInfo.map((item) => item?.name);
        payload.wards = wards.sort();
      }
    } else if (district) return errorMessage(404, 'Lỗi, nhập tỉnh thành để có thể xem quận huyện!');

    return payload;
  } catch (error) {
    console.log(colors.red(`getDistrictByProvinceService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function restoreDeletedOrderService(keyword) {
  try {
    const deletedOrders = await scanService(
      SCAN_REDIS_KEY_TYPE.DELETED_ORDER, keyword);

    if (deletedOrders.length < 1) return errorMessage(404, 'Lỗi, không tìm thấy đơn hàng trong thùng rác!');
    for(const order of deletedOrders) {
      await OrderModel.findOneAndUpdate({
        _id: new mongoose.Types.ObjectId(order?.value?._id),
        user: new mongoose.Types.ObjectId(order?.value?.user)
      }, { $set: order?.value }, { upsert: true });
      await RedisClient.redisDel(order?.key);
    }
    return true;
  } catch (error) {
    console.log(colors.red(`restoreDeletedOrderService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function revenueStatisticsService(year, monthYear, fromDate, toDate) {
  try {
    const matchCond = {};
    const groupCond = {
      _id: '$date',
      totalMoney: {
        $sum: '$totalPrice'
      }
    };
    if (moment(year, 'YYYY', true).isValid() && typeof year === 'string' && year.trim() !== '') {
      matchCond.year = year;
      groupCond._id = '$monthYear';
    }
    else if (moment(monthYear, 'YYYY-MM', true).isValid() && typeof monthYear === 'string' && monthYear.trim() !== '') {
      matchCond.monthYear = monthYear;
    }
    else if ((moment(fromDate, 'YYYY-MM', true).isValid() && typeof fromDate === 'string' && fromDate.trim() !== '')
            || (moment(toDate, 'YYYY-MM-DD', true).isValid() && typeof toDate === 'string' && toDate.trim() !== '')) {
      matchCond.date = {
        $gte: fromDate,
        $lte: toDate
      }; 
    }

    const pipeline = [ 
      { $project: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$paidAt"
            }
          },
          monthYear: {
            $dateToString: {
              format: "%Y-%m",
              date: "$paidAt"
            }
          },
          year: {
            $dateToString: {
              format: "%Y",
              date: "$paidAt"
            }
          },
          totalPrice: 1
      }},
      { $match: matchCond }, 
      { $group: groupCond },
      { $sort: {
        _id: 1
      }}
    ];

    const revenue = await OrderModel.aggregate(pipeline);
    let totalRevenue = 0;
    revenue.forEach((item) => {
      totalRevenue += item.totalMoney;
    });
    const payload = {
      revenue,
      totalRevenue
    }
    return payload;

  } catch (error) {
    console.log(colors.red(`revenueStatisticsService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}
