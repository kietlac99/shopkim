/* eslint-disable max-len */
import { body, param } from "express-validator";

import validatorErrorHandler from "../../api/validatorErrorHandler";

export const getRegiserUserValidator = [
  body("name")
    .isString()
    .withMessage("Tên không hợp lệ!")
    .notEmpty()
    .withMessage("Nhập tên!"),
  body("email")
    .notEmpty()
    .withMessage("Nhập email!")
    .isEmail()
    .withMessage("Email không hợp lệ!"),
  body("password")
    .isString()
    .withMessage("Mật khẩu không hợp lệ!")
    .isStrongPassword()
    .withMessage(
      "Mật khẩu chưa đủ mạnh, minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1"
    ),
  validatorErrorHandler,
];

export const getLoginUserValidator = [
  body("email")
    .notEmpty()
    .withMessage("Nhập email!")
    .isEmail()
    .withMessage("Email không hợp lệ!"),
  body("password")
    .isString()
    .withMessage("Mật khẩu không hợp lệ!")
    .notEmpty()
    .withMessage("Nhập mật khẩu!"),
  validatorErrorHandler,
];

export const getMongoDbIdValidator = [
  param("id").isMongoId().withMessage("Lỗi, không tìm thấy người dùng"),
  validatorErrorHandler,
];
export const updateUserValidator = [
  param("id").isMongoId().withMessage("Lỗi, không tìm thấy người dùng"),
  body("role")
    .isIn(["admin", "user"])
    .withMessage("Lỗi, quyền chỉ có admin hoặc user!"),
  validatorErrorHandler,
];

export const restoreDeletedUserValidator = [
  body('keyword').isString().withMessage('Lỗi, từ khóa không khả dụng'),
  validatorErrorHandler
]

export const confirmEmailValidator = [
  param('email').isEmail().withMessage('Lỗi, email không khả dụng!'),
  validatorErrorHandler
]
