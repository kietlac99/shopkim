import { Router } from "express";

import * as RedisStoreController from './redisStore.controller';
import * as RedisStoreValidator from './redisStore.validator';

import { isAuthenticatedUser, authorizeRoles } from "../../middleware/auth";

const router = new Router();

router
    .route('/scan')
    .post(
        isAuthenticatedUser(),
        authorizeRoles('admin'),
        RedisStoreValidator.scanValidator,
        RedisStoreController.scanController
    );

export default router;