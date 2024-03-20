/* eslint-disable require-jsdoc */
export default class ResponseHandler {
  constructor(res) {
    this.res = res;
  }
  success(data) {
    if (data) {
      return this.res.json({
        success: true,
        payload: data,
      });
    }
    return this.res.json({success: true});
  }

  cookie(type, token, options, data) {
    if (type && token && options && data) {
      return this.res.cookie(type, token, options).json({
        success: true,
        token,
        data,
      });
    }
  }

  errorParam(data) {
    return this.res.json({
      status: data.status,
      success: false,
      error: data.error,
    });
  }

  error(error) {
    if (!error.statusCode) console.error(error.stack);
    return this.res.status(error.statusCode).json({
      success: false,
      errors: error.errors,
    });
  }

  paging([count = 0, data = []], page = 1, limit = 10) {
    return this.res.status(200).json({
      success: true,
      total_page: Math.ceil(count / limit),
      total_item: count,
      page,
      item: data.length,
      payload: data,
    });
  }
}
