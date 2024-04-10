import { Router } from "express";

import { isAuthenticatedUser, authorizeRoles } from "../../middleware/auth";
import * as OrderController from "./order.controller";
import * as OrderValidator from "./order.validator";

const router = new Router();

router
  .route("/new")
  .post(isAuthenticatedUser(), OrderController.newOrderController);

router
  .route("/:id")
  .get(
    isAuthenticatedUser(),
    OrderValidator.getMongoIdValidator,
    OrderController.getSingleOrderController
  );

router
  .route("/orders/me")
  .get(isAuthenticatedUser(), OrderController.myOrdersController);

router
  .route("/admin/orders")
  .get(
    isAuthenticatedUser(),
    authorizeRoles("admin"),
    OrderController.allOrdersController
  );

router
  .route("/admin/order/:id")
  .put(
    isAuthenticatedUser(),
    authorizeRoles("admin"),
    OrderValidator.updateOrderValidator,
    OrderController.updateOrderController
  )
  .delete(
    isAuthenticatedUser(),
    authorizeRoles("admin"),
    OrderValidator.getMongoIdValidator,
    OrderController.deleteOrderController
);

router.route('/location')
  .post(
    OrderController.getLocationsController
  );

router.route('/restore-deleted-orders')
  .post(
    isAuthenticatedUser(),
    authorizeRoles("admin"),
    OrderValidator.restoreDeletedOrdersValidator,
    OrderController.restoreDeletedOrderController
  )

export default router;
