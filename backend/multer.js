import path from 'path';
import multer from 'multer';

import { FILE_UPLOAD_DESTINATION } from './config';
import APIError from './util/APIError';

export const PATH_FILE = path.resolve(__dirname, FILE_UPLOAD_DESTINATION);
const STATIC_PATH = path.resolve(__dirname, '../public/images');

const storageFile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATH_FILE);
  },
  filename: async (req, file, cb) => {
    const orinialName = file.originalname;
    const fileExtension = path.extname(orinialName) || '';
    const finalName = `${path.parse(orinialName).name}-${new Date().getTime()}${fileExtension}`;
    cb(null, finalName);
  }
});

const uploadFileImage = multer({
  storage: storageFile,
  // limits: limits,
  fileFilter: (req, file, cb) => {
    const originalname = file.originalname.toLowerCase();
    if (!originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new APIError(422, [{
        msg: 'Only image files are allowed!',
        param: 'Image File invalid',
        location: 'body'
      }]));
    }
    return cb(null, true);
  }
});

export const middlewareUploadFileImage = uploadFileImage.single('imageFile');

export const middlewareUploadFileImages = uploadFileImage.array('imageFiles');
