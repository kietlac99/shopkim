/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import APIError from './util/APIError';
import moment from 'moment';

export async function hashPassword(password) {
  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    return new new APIError(401, {access: false, message: error.message});
  }
}

export async function verifyPassword(password, hashedPassword) {
  try {
    const isPasswordMatch = await bcryptjs.compare(password, hashedPassword);
    return isPasswordMatch;
  } catch (error) {
    return new new APIError(401, {access: false, message: error.message});
  }
}

export function getResetPasswordToken(user) {
  try {
    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordExpire = moment.now() + 30 * 60 * 1000 + 7 * 60 * 60 * 1000;

    return resetToken;
  } catch (error) {
    return new new APIError(401, {access: false, message: error.message});
  }
}
