import { Router } from "express";

import * as PaymentController from './payment.controller';

import { isAuthenticatedUser } from "../../middleware/auth";

const router = new Router();

router.route('/stripe-process')
    .post(
        isAuthenticatedUser(),
        PaymentController.processStripePaymentController
    );

router.route('/stripeapi')
    .get(
        isAuthenticatedUser(),
        PaymentController.sendStripeApiController
    );

export default router;
