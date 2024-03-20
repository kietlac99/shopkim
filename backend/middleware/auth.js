import jwt from "jsonwebtoken";
import UserModel from "../schema/user.model";

import * as RedisClient from "../util/Redis";

import { JWT_SECRET, JWT_EXPIRES_TIME } from "../config";
import APIError from "../util/APIError";

export async function getUserJwtToken(id) {
  try {
    const token = jwt.sign({ id: id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_TIME,
    });

    return token;
  } catch (error) {
    return false;
  }
}

export function isAuthenticatedUser() {
  return async(req, res, next) => {
    try {

      const token = req.header("Authorization");
      
      if (typeof token !== 'string') {
        return next(res.status(401).json({
          errors: [
            {
              access: false,
              message: 'Unauthorized'
            }
          ]
        }));
      }
  
      const KEY_USER_TOKEN = `KEY_USER_TOKEN_${token}`;
      const hasRedis = await RedisClient.redisGet(KEY_USER_TOKEN);
      if (hasRedis)
        return next(res.status(401).json({
          errors: [
            {
              access: false,
              message: 'Unauthorized'
            }
          ]
        }));
      if (!token)
        return next(new APIError(401, { access: false, message: "Unauthorized" }));
      
      let decoded = null;
      
      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch (error) {
        return next(res.status(401).json({
          errors: [
            {
              access: false,
              message: 'Unauthorized'
            }
          ]
        }));
      }
      
      if (!decoded)
      return next(res.status(401).json({
        errors: [
          {
            access: false,
            message: 'Unauthorized'
          }
        ]
      }));
      req.user = await UserModel.findById(decoded.id);
  
      return next();
    } catch (error) {
      console.log(error.message);
      return next();
    }
  };
}

export function authorizeRoles(...roles) {
  try {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(res.status(401).json({
          errors: [
            {
              access: false,
              message: `Role (${req.user.role}) is not allowed to access this resource`,
            }
          ]
        }));
      }
      return next();
    };
  } catch (error) {
    return (next) => {
      return next(res.status(500).json({
        errors: [
          {
            access: false,
            message: error.message
          }
        ]
      }));
    };
  }
}
