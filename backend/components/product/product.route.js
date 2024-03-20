import { Router } from "express";

import * as ProductController from "./product.controller";
import * as ProductValidator from "./product.validator";
import * as ProductMulter from './product.multer';
import { isAuthenticatedUser, authorizeRoles } from "../../middleware/auth";

const router = new Router();

router.route("/products").get(ProductController.getProductsController);

router.route('/admin/products')
      .get(
        isAuthenticatedUser(),
        authorizeRoles("admin"),
        ProductController.getAdminProductsController
      );

router
  .route("/admin/new")
  .post(
    isAuthenticatedUser(),
    authorizeRoles("admin"),
    ProductMulter.uploadProductImageFiles,
    ProductValidator.getNewProductValidator,
    ProductController.newProductController
  );

router
  .route("/:productId")
  .get(
    ProductValidator.getProductIdValidator,
    ProductController.getSingleProductController
  );

router
  .route("/admin/:productId")
  .put(
    isAuthenticatedUser(),
    authorizeRoles("admin"),
    ProductMulter.uploadProductImageFiles,
    ProductValidator.getUpdateProductValidator,
    ProductController.updateProductController
  )
  .delete(
    isAuthenticatedUser(),
    authorizeRoles("admin"),
    ProductValidator.getProductIdValidator,
    ProductController.deleteProductController
  );

router
  .route("/review")
  .put(
    isAuthenticatedUser(),
    ProductValidator.createProductReviewValidator,
    ProductController.createProductReviewController
  );

router
  .route("/review/reviews")
  .get(
    isAuthenticatedUser(),
    authorizeRoles('admin'),
    ProductValidator.getProductReviewsValidator,
    ProductController.getProductReviewsController
  )
  .delete(
    isAuthenticatedUser(),
    authorizeRoles('admin'),
    ProductValidator.deleteReviewValidator,
    ProductController.deleteReviewController
  );

export default router;
