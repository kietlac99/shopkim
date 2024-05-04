/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import UserModel from "../../schema/user.model";
import colors from "colors";
import * as RedisClient from "../../util/Redis";
import cloudinary from 'cloudinary';

import { ERROR_CODE, DEFAULT_AVATAR, EXPIRES_TIME_CHANGE, SCAN_REDIS_KEY_TYPE } from "../../constants";
import errorMessage from "../../util/error";
//import { sendEmail } from "../../util/sendEmail";
import { nodeMailerSendEmail } from '../../util/smtp/nodemailer';
import * as Hash from "../../hash";
import * as Auth from "../../middleware/auth";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { parseISOToString } from "../../helpers/date.helper";
import zxcvbn from "zxcvbn";
import { contentHTMLResetPasswordEmail, contentHTMLConfirmEmail } from '../../../mailTemplate/resetPassword.temp';
import mongoose from 'mongoose';

import { 
  REDIS_USER_TOKEN_KEY_EXPIRES_TIME, 
  JWT_SECRET, 
  FRONTEND_URL,
  SENDER_EMAIL,
} from "../../config";

export function validatePasswordStrengthService(password) {
  try {
    const result = zxcvbn(password);
    if (result.score < 3) return false;
    return true;
  } catch (error) {
    console.log(colors.red(`validatePasswordStrengthService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function registerUserService(name, email, password, avatar) {
  try {
    const deletedUsers = await RedisClient.findKeysContainingString(
      SCAN_REDIS_KEY_TYPE.DELETED_USER, email);

    if (deletedUsers.length > 0) return errorMessage(422, "Lỗi, email không khả dụng!");

    const countUser = await UserModel.countDocuments({ email: email });
    if (countUser > 0) return errorMessage(422, "Lỗi, email không khả dụng!");

    const hashedPassword = await Hash.hashPassword(password);

    let result = {};

    if (avatar) {
      result = await cloudinary.v2.uploader.upload(avatar, {
        folder: 'ShopKim/avatars',
        width: 150,
        crop: "scale"
      });
    } else {
      result.public_id = DEFAULT_AVATAR.public_id;
      result.secure_url = DEFAULT_AVATAR.secure_url;
    }

    const confirmUrl = `${FRONTEND_URL}/#/register/confirm/${email}`;

    const keyExpiresTime = EXPIRES_TIME_CHANGE;
    const redisKey = `USER_REGISTRATION_${email}`;
    await RedisClient.setTextByKey(
      redisKey,
      keyExpiresTime,
      JSON.stringify({
        name, 
        email, 
        password: hashedPassword, 
        avatar: {
          public_id: result.public_id,
          url: result.secure_url
        }
      })
    );

    await nodeMailerSendEmail(
      SENDER_EMAIL, email, 'bucu130599@gmail.com', 'XÁC NHẬN EMAIL',
      contentHTMLConfirmEmail(name, confirmUrl)
    );
    const payload = `Email được gửi đến: ${email}`;
    return payload;
  } catch (error) {
    console.log(colors.red(`registerUserService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function emailConfirmService(email) {
  try {
    const userRegister = await RedisClient.findKeysContainingString
      (SCAN_REDIS_KEY_TYPE.USER_REGISTRATION, email);
    if (userRegister.length < 1) return errorMessage(401, 'Link đã hết hạn!');
    let token = null;
    for(const user of userRegister) {
      const time = await RedisClient.timeRemaining(user?.key);
      if (time <= (EXPIRES_TIME_CHANGE - 30 * 60)) {
        return errorMessage(401, 'Link đã hết hạn!');
      }
      
      const createdUser = await UserModel.create({
        name: user?.value?.name,
        email: user?.value?.email,
        password: user?.value?.password,
        avatar: {
          public_id: user?.value?.avatar?.public_id,
          url: user?.value?.avatar?.url
        },
      });

      token = Auth.getUserJwtToken(createdUser._id);
      await RedisClient.redisDel(user?.key);
    }
    if (token === null) return errorMessage(401, 'Link đã hết hạn!');
    return token;
  } catch (error) {
    console.log(colors.red(`emailConfirmService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function loginUserService(email, password) {
  try {
    const user = await UserModel.findOne({ email: email }).select("+password");
    if (!user)
      return errorMessage(404, "Lỗi, kiểm tra lại email hoặc mật khẩu!");

    const isPasswordMatched = await Hash.verifyPassword(
      password,
      user.password
    );
    if (!isPasswordMatched) {
      return errorMessage(404, "Lỗi, kiểm tra lại email hoặc mật khẩu!");
    }

    const token = Auth.getUserJwtToken(user._id);

    return token;
  } catch (error) {
    console.log(colors.red(`loginUserService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function getUserProfileService(id) {
  try {
    const user = await UserModel.findById(id);

    return user;
  } catch (error) {
    console.log(colors.red(`getUserProfileService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function logoutService(token) {
  try {
    if (!token) return errorMessage(500, ERROR_CODE.NOT_FOUND_ERROR);
    const decoded = jwt.verify(token, JWT_SECRET);
    const redisExpiresTime = REDIS_USER_TOKEN_KEY_EXPIRES_TIME * 24 * 60 * 60;
    const KEY_USER_TOKEN = `KEY_USER_TOKEN_${token}`;
    await RedisClient.setTextByKey(
      KEY_USER_TOKEN,
      redisExpiresTime,
      JSON.stringify(decoded.id)
    );
    return true;
  } catch (error) {
    console.log(colors.red(`logoutService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function forgotPasswordService(req) {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (!user) return `Email sent to: ${email}`;

    const resetToken = Hash.getResetPasswordToken(user);

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${FRONTEND_URL}/#/password/reset/${resetToken}`;

    //const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nNếu bạn không yêu cầu gửi mail này thì hãy bỏ qua nó.`;

    try {
      //await sendEmail(user.email, "Khôi phục mật khẩu tài khoản ShopKim", message);
      await nodeMailerSendEmail(
        SENDER_EMAIL, user.email, 'bucu130599@gmail.com', 'TẠO MỚI MẬT KHẨU',
        contentHTMLResetPasswordEmail(user.name, resetUrl)
      );
      const payload = `Email được gửi đến: ${user.email}`;
      return payload;
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
    }
  } catch (error) {
    console.log(colors.red(`forgotPasswordService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function resetPasswordService(token, password, confirmPassword) {
  try {
    const date = parseISOToString();
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await UserModel.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: date }
    });

    if (!user)
      return errorMessage(404, "Lỗi, token khôi phục mật khẩu không khả dụng!");

    if (!password)
      return errorMessage(404, "Lỗi, mật khẩu không được để trống");

    const isStrongPassword = validatePasswordStrengthService(password);
    if (!isStrongPassword)
      return errorMessage(404, "Lỗi, mật khẩu chưa đủ mạnh!");

    if (password !== confirmPassword)
      return errorMessage(404, "Lỗi, mật khẩu không trùng khớp");

    const hashedPassword = await Hash.hashPassword(password);

    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    const sendToken = Auth.getUserJwtToken(user._id);

    return sendToken;
  } catch (error) {
    console.log(colors.red(`resetPasswordService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function updatePasswordService(
  id,
  oldPassword,
  password,
  confirmPassword
) {
  try {
    const user = await UserModel.findById(id).select("+password");

    const isMatched = await Hash.verifyPassword(oldPassword, user.password);
    if (!isMatched) return errorMessage(404, "Lỗi, Mật khẩu không đúng!");

    if (!password)
      return errorMessage(404, "Lỗi, mật khẩu không được để trống");
    const isStrongPassword = validatePasswordStrengthService(password);
    if (!isStrongPassword)
      return errorMessage(404, "Lỗi, mật khẩu chưa đủ mạnh!");

    if (password !== confirmPassword)
      return errorMessage(404, "Lỗi, mật khẩu không trùng khớp");

    const hashedPassword = await Hash.hashPassword(password);
    user.password = hashedPassword;

    await user.save();

    const sendToken = Auth.getUserJwtToken(user._id);

    return sendToken;
  } catch (error) {
    console.log(colors.red(`resetPasswordService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function updateProfileService(name, email, id, avatar) {
  try {
    const newUserData = {
      name: name,
      email: email,
    };
    const hasUser = await UserModel.findOne({ _id: id, email: email }).lean();
    if (!hasUser) {
      const hasEmailUser = await UserModel.findOne({ email: email }).lean();
      if (hasEmailUser) return errorMessage(404, "Lỗi, email không khả dụng!");
    }
    
    if (avatar) {
      const user = await UserModel.findById(id);

      const image_id = user.avatar.public_id;
      const res = await cloudinary.v2.uploader.destroy(image_id);

      const result = await cloudinary.v2.uploader.upload(avatar, {
        folder: 'ShopKim/avatars',
        width: 150,
        crop: "scale"
      });

      newUserData.avatar = {
        public_id: result.public_id,
        url: result.secure_url
      }
    }

    await UserModel.findByIdAndUpdate(id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    return true;
  } catch (error) {
    console.log(colors.red(`updateProfileService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function allUsersService() {
  try {
    const users = await UserModel.find({ email: { $ne: 'admin@gmail.com' } });

    return users;
  } catch (error) {
    console.log(colors.red(`allUsersService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function getUserDetailsService(id) {
  try {
    const user = await UserModel.findById(id);

    if (!user)
      return errorMessage(404, `Lỗi, Không tìm thấy người dùng với id : ${id}`);

    return user;
  } catch (error) {
    console.log(colors.red(`getUserDetailsService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function updateUserService(name, email, role, id) {
  try {
    const newUserData = {
      name: name,
      email: email,
      role: role,
    };

    const hasUser = await UserModel.findOne({ _id: id, email: email }).lean();
    if (!hasUser) {
      const hasEmailUser = await UserModel.findOne({ email: email }).lean();
      if (hasEmailUser) return errorMessage(404, "Lỗi, email không khả dụng!");
    }

    await UserModel.findByIdAndUpdate(id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    return true;
  } catch (error) {
    console.log(colors.red(`updateUserService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function deleteUserService(id) {
  try {
    const user = await UserModel.findById(id);

    if (!user)
      return errorMessage(404, `Lỗi, Không tìm thấy người dùng với id : ${id}`);

    const keyExpiresTime = 31 * EXPIRES_TIME_CHANGE;
    const deleteKey = `DELETED_USER_${user._id}_${user.email}_${user.name}`;
    await RedisClient.setTextByKey(
      deleteKey,
      keyExpiresTime,
      JSON.stringify(user)
    );

    await user.deleteOne();

    return true;
  } catch (error) {
    console.log(colors.red(`deleteUserService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function restoreDeletedUserService(keyword) {
  try {
    const deletedUsers = await RedisClient.findKeysContainingString(
      SCAN_REDIS_KEY_TYPE.DELETED_USER, keyword);

    if (deletedUsers.length < 1) return errorMessage(404, 'Lỗi, không tìm thấy sản phẩm trong thùng rác!');

    let hasDeletedKey = false;
    for(const user of deletedUsers) {
      const time = await RedisClient.timeRemaining(user?.key);
      if (time <= EXPIRES_TIME_CHANGE) {
        continue;
      } else hasDeletedKey = true;
      
      await UserModel.findOneAndUpdate({
        name: user?.value?.email,
        _id: new mongoose.Types.ObjectId(user?.value?._id)
      }, { $set: user?.value }, { upsert: true });
      
      await RedisClient.redisDel(user?.key);
    }

    if (!hasDeletedKey) return errorMessage(404, 'Lỗi, không tìm thấy người dùng trong thùng rác!');

    return true;
  } catch (error) {
    console.log(colors.red(`restoreDeletedUserService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}

export async function googleLoginService(name, email, provider, provideAccountId) {
  try {
    const user = UserModel.findOne({ provideAccountId, provider });
    let token = null;
    if (!user) {
      const createdUser = await UserModel.create({
        name,
        email,
        provider,
        provideAccountId,
        avatar: {
          public_id: DEFAULT_AVATAR.public_id,
          url: DEFAULT_AVATAR.secure_url
        }
      });

      token = Auth.getUserJwtToken(createdUser._id);
      
    } else token = Auth.getUserJwtToken(user._id);

    return token;
  } catch (error) {
    console.log(colors.red(`googleLoginService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}
