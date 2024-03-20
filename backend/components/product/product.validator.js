/* eslint-disable max-len */
import { param, body, query } from "express-validator";

import validatorErrorHandler from "../../api/validatorErrorHandler";

export const getNewProductValidator = [
  body("name")
    .isString()
    .notEmpty()
    .withMessage("Nhập tên sản phẩm!")
    .isLength({ max: 100 })
    .withMessage("Độ dài tối đa của tên sản phẩm là 100!"),
  body("price")
    .isDecimal()
    .withMessage("Giá tiền không hợp lệ!")
    .notEmpty()
    .withMessage("Nhập giá tiền sản phẩm!"),
  body("description").isString().notEmpty().withMessage("Nhập mô tả sản phẩm!"),
  body("category").notEmpty().withMessage("Chọn danh mục!"),
  body("seller").isString().notEmpty().withMessage("Chọn nguồn bán!"),
  body("stock")
    .isInt()
    .withMessage("Số lượng sản phẩm không hợp lệ!")
    .notEmpty()
    .withMessage("Nhập số lượng sản phẩm!"),
  validatorErrorHandler,
];

export const getUpdateProductValidator = [
  param("productId")
    .isMongoId()
    .withMessage("Id sản phẩm không hợp lệ!")
    .notEmpty()
    .withMessage("Nhập Id sản phẩm!"),
  body("name")
    .isString()
    .notEmpty()
    .withMessage("Nhập tên sản phẩm!")
    .isLength({ max: 100 })
    .withMessage("Độ dài tối đa của tên sản phẩm là 100"),
  body("price")
    .isDecimal()
    .withMessage("Giá tiền không hợp lệ!")
    .notEmpty()
    .withMessage("Nhập giá tiền sản phẩm!"),
  body("description").isString().notEmpty().withMessage("Nhập mô tả sản phẩm!"),
  body("category")
    .isIn(["Áo vest", "Quần tây", "Đầm"])
    .withMessage("Danh mục không khả dụng!")
    .notEmpty()
    .withMessage("Chọn danh mục!"),
  body("seller").isString().notEmpty().withMessage("Chọn nguồn bán!"),
  body("stock")
    .isInt()
    .withMessage("Số lượng sản phẩm không hợp lệ!")
    .notEmpty()
    .withMessage("Nhập số lượng sản phẩm!"),
  validatorErrorHandler,
];

export const getProductIdValidator = [
  param("productId").isMongoId().withMessage("Id sản phẩm không hợp lệ!"),
  validatorErrorHandler,
];

export const createProductReviewValidator = [
  body("productId").isMongoId().withMessage("Id sản phẩm không hợp lệ!"),
  body("rating").isString().notEmpty().withMessage("Đánh giá đang để trống!"),
  validatorErrorHandler,
];

export const getProductReviewsValidator = [
  query("productId").isMongoId().withMessage("Id sản phẩm không hợp lệ!"),
  validatorErrorHandler,
];

export const deleteReviewValidator = [
  query("productId").isMongoId().withMessage("Id sản phẩm không hợp lệ!"),
  query("reviewId").isMongoId().withMessage("Id sản phẩm không hợp lệ!"),
  validatorErrorHandler,
];
