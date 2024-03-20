import path from 'path';
import multer from 'multer';

import APIError from '../../util/APIError';

export const FILE_IMAGE_DESTINATION = path.resolve(__dirname, '../../../uploads');

const storageFile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, FILE_IMAGE_DESTINATION);
  },
  filename: async (req, file, cb) => {
    const originalname = file.originalname;
    const fileExtension = path.extname(originalname) || '';
    const finalName = `${path.parse(originalname).name}-${new Date().getTime()}${fileExtension}`;
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

export const uploadProductImageFiles = uploadFileImage.array('productImageFiles');
