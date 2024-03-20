/* eslint-disable require-jsdoc */
import APIError from "./APIError";

export default function errorMessage(code, message, param) {
  return Promise.reject(
    new APIError(code, [
      {
        message: message || code,
        param: param || message,
      },
    ])
  );
}
