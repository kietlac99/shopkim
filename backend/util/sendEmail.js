import nodemailer from 'nodemailer';
import APIError from './APIError';
import {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_EMAIL,
  SMTP_PASSWORD,
  SMTP_FROM_NAME,
  SMTP_FROM_EMAIL,
} from '../config';

export const sendEmail = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
      },
    });

    const messages = {
      from: `${SMTP_FROM_NAME} <${SMTP_FROM_EMAIL}>`,
      to: email,
      subject: subject,
      text: message,
    };
    await transporter.sendMail(messages);
  } catch (error) {
    return new APIError(404, 'Lỗi, gửi email không thành công!');
  }
};
