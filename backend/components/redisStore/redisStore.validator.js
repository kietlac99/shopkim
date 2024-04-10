import validatorErrorHandler from "../../api/validatorErrorHandler";

import { body } from "express-validator";

export const scanValidator = [
    body('scanType').isString().withMessage('Lỗi, loại quét không hợp lệ!'),
    body('keyword').isString().withMessage('Lỗi, từ khóa không hợp lệ'),
    validatorErrorHandler
]