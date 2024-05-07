/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import * as OrderService from "./order.service";

export async function newOrderController(req, res) {
  try {
    const {
      orderItems,
      shippingInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentInfo,
    } = req.body;
    const id = req.user._id;
    const process = await OrderService.newOrderService(
      orderItems,
      shippingInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentInfo,
      id
    );
    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function getSingleOrderController(req, res) {
  try {
    const { id } = req.params;
    const process = await OrderService.getSingleOrderService(id);
    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function myOrdersController(req, res) {
  try {
    const id = req.user._id;
    const process = await OrderService.myOrdersService(id);
    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function allOrdersController(req, res) {
  try {
    const process = await OrderService.allOrdersService();
    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function updateOrderController(req, res) {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const process = await OrderService.updateOrderService(id, orderStatus);
    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function deleteOrderController(req, res) {
  try {
    const { id } = req.params;

    const process = await OrderService.deleteOrderService(id);
    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function getLocationsController(req, res) {
  try {
    const { province, district } = req.body;

    const process = await OrderService.getLocationsService(province, district);
    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function restoreDeletedOrderController(req, res) {
  try {
    const { keyword } = req.body;
    const process = await OrderService.restoreDeletedOrderService(keyword);
    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function revenueStatisticsController(req, res) {
  try {
    const { fromDate, toDate, year, monthYear } = req.body;
    const process = await OrderService.revenueStatisticsService(year, monthYear, fromDate, toDate);
    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}
