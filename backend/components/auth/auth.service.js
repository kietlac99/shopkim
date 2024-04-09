/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import UserModel from "../../schema/user.model";
import colors from "colors";
import * as RedisClient from "../../util/Redis";
import cloudinary from 'cloudinary';

import { ERROR_CODE, DEFAULT_AVATAR } from "../../constants";
import errorMessage from "../../util/error";
//import { sendEmail } from "../../util/sendEmail";
import { nodeMailerSendEmail } from '../../util/smtp/nodemailer';
import * as Hash from "../../hash";
import * as Auth from "../../middleware/auth";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { parseISOToString } from "../../helpers/date.helper";
import zxcvbn from "zxcvbn";
import { contentHTMLResetPasswordEmail } from '../../../mailTemplate/resetPassword.temp'

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

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      avatar: {
        public_id: result.public_id,
        url: result.secure_url
      },
    });

    const token = Auth.getUserJwtToken(user._id);

    return token;
  } catch (error) {
    console.log(colors.red(`registerUserService error: ${error}`));
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
      const payload = `Email sent to: ${user.email}`;
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

    if (user.avatar?.public_id !== DEFAULT_AVATAR.public_id)
    {
      const image_id = user.avatar?.public_id;
      if (image_id) {
        const res = await cloudinary.v2.uploader.destroy(image_id);
      }
    }

    await user.deleteOne();

    return true;
  } catch (error) {
    console.log(colors.red(`deleteUserService error: ${error}`));
    return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}
