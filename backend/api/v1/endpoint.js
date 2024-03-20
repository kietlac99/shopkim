import { Router } from "express";

import ProductRoute from "../../components/product/product.route";
import AuthRoute from "../../components/auth/auth.route";
import OrderRoute from "../../components/order/order.route";
import PaymentRoute from '../../components/payment/payment.route';

const router = new Router();

router.use("/product", [ProductRoute]);
router.use("/auth", [AuthRoute]);
router.use("/order", [OrderRoute]);
router.use("/payment", [PaymentRoute]);

export default router;
