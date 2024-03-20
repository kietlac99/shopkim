import { param, body } from "express-validator";

import validatorErrorHandler from "../../api/validatorErrorHandler";

export const getMongoIdValidator = [
  param("id").isMongoId().withMessage("Lỗi, không tìm thấy order!"),
  validatorErrorHandler,
];

export const updateOrderValidator = [
  param("id").isMongoId().withMessage("Lỗi, không tìm thấy order!"),
  body("orderStatus")
    .isString()
    .notEmpty()
    .withMessage("Lỗi, trạng thái đơn đặt hàng đang trống!"),
  validatorErrorHandler,
];
