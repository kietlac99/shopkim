import { Router } from "express";

import * as AuthController from "./auth.controller";
import * as AuthValidator from "./auth.validator";
import * as AuthMulter from './auth.multer';

import { isAuthenticatedUser, authorizeRoles } from "../../middleware/auth";

const router = new Router();

const errorHandler = (err, req, res, next) => {
  // Log the error
  console.error(err.stack);
  // Send an appropriate response to the client
  res.status(500).send('Internal Server Error');
};

router
  .route("/register")
  .post(
    AuthMulter.uploadAvatarImageFile,
    AuthValidator.getRegiserUserValidator,
    AuthController.resgisterUserController
  );

router
  .route("/login")
  .post(
    AuthValidator.getLoginUserValidator,
    AuthController.loginUserController
  );

router.route("/logout").get(AuthController.logoutController);

router
  .route("/me")
  .get(isAuthenticatedUser(), AuthController.getUserProfileController);

router.route("/password/forgot")
  .post(
    AuthController.forgotPasswordController);

router
  .route("/password/reset/:token")
  .put(AuthController.resetPasswordController);

router
  .route("/password/update")
  .put(isAuthenticatedUser(), AuthController.updatePasswordController);

router
  .route("/me/update")
  .put(
    isAuthenticatedUser(), 
    AuthMulter.uploadAvatarImageFile,
    AuthController.updateProfileController
  );

router
  .route("/admin/users")
  .get(
    isAuthenticatedUser(),
    authorizeRoles("admin"),
    AuthController.allUsersController
  );

router
  .route("/admin/user/:id")
  .get(
    isAuthenticatedUser(),
    authorizeRoles("admin"),
    AuthValidator.getMongoDbIdValidator,
    AuthController.getUserDetailsController
  )
  .put(
    isAuthenticatedUser(),
    authorizeRoles("admin"),
    AuthValidator.updateUserValidator,
    AuthController.updateUserController
  )
  .delete(
    isAuthenticatedUser(),
    authorizeRoles("admin"),
    AuthValidator.getMongoDbIdValidator,
    AuthController.deleteUserController
  );

  router.use(errorHandler);

export default router;
