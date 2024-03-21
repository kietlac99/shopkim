/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import * as AuthService from "./auth.service";
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

export async function resgisterUserController(req, res) {
  try {
    const imageFile = req?.file;
    
    const avatar = imageFile?.path;
    
    const removeFilePromise = promisify(fs.unlink);
    try {
      const { name, email, password } = req.body;
      const process = await AuthService.registerUserService(
        name,
        email,
        password,
        avatar
      );
      if (avatar) await removeFilePromise(path.resolve(__dirname, `../../../uploads/${req.file.filename}`));
      return res.RH.success(process);
    } catch (error) {
      if (avatar) await removeFilePromise(path.resolve(__dirname, `../../../uploads/${req.file.filename}`));
      return res.RH.error(error);
    }
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;
    const process = await AuthService.loginUserService(email, password);
    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function logoutController(req, res) {
  try {
    const token = req.header("Authorization");
    const process = await AuthService.logoutService(token);
    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function getUserProfileController(req, res) {
  try {
    const id = req.user?._id;
    const process = await AuthService.getUserProfileService(id);
    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function forgotPasswordController(req, res) {
  try {
    const process = await AuthService.forgotPasswordService(req);

    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function resetPasswordController(req, res) {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    const process = await AuthService.resetPasswordService(
      token,
      password,
      confirmPassword
    );
    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function updatePasswordController(req, res) {
  try {
    const id = req.user._id;
    const { oldPassword, password, confirmPassword } = req.body;
    const process = await AuthService.updatePasswordService(
      id,
      oldPassword,
      password,
      confirmPassword
    );
    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function updateProfileController(req, res) {
  try {

    const imageFile = req?.file;
    
    const avatar = imageFile?.path;

    let removeFilePromise = {};

    if (avatar) removeFilePromise = promisify(fs.unlink);
    
    try {
      const id = req.user._id;
      const { name, email } = req.body;
      const process = await AuthService.updateProfileService(name, email, id, avatar);
      if (avatar) await removeFilePromise(path.resolve(__dirname, `../../../uploads/${req?.file?.filename}`));
      return res.RH.success(process);
    } catch (error) {
      if (avatar) await removeFilePromise(path.resolve(__dirname, `../../../uploads/${req?.file?.filename}`));
      return res.RH.error(error);
    }
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function allUsersController(req, res) {
  try {
    const process = await AuthService.allUsersService();
    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function getUserDetailsController(req, res) {
  try {
    const { id } = req.params;
    const process = await AuthService.getUserDetailsService(id);
    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function updateUserController(req, res) {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const process = await AuthService.updateUserService(name, email, role, id);
    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}

export async function deleteUserController(req, res) {
  try {
    const { id } = req.params;
    const process = await AuthService.deleteUserService(id);
    return res.RH.success(process);
  } catch (error) {
    return res.RH.error(error);
  }
}
