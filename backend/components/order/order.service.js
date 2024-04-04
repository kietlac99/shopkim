/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import OrderModel from "../../schema/order.model";
import ProductModel from "../../schema/product.model";
import ProvinceModel from '../../schema/province.model';

import colors from "colors";
import { parseISOToString } from "../../helpers/date.helper";
import { ERROR_CODE } from "../../constants";
import errorMessage from "../../util/error";

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
    const hasProvince = await ProductModel.countDocuments({ name: province });
    if (hasProvince < 1) return true;

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
