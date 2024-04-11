export const contentHTMLResetPasswordEmail = (receiver, resetLink) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Password</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 50px auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
          color: #333333;
        }
        p {
          color: #666666;
        }
        a {
          color: #007bff;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Tạo Mới Mật Khẩu Của Bạn</h2>
        <p>Xin chào <b>${receiver}</b>,</p>
        <p>Chúng tôi đã nhận yêu cầu tạo mới mật khẩu của bạn. Nhấn vào đường dẫn bên dưới để tạo lại mật khẩu của bạn:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>Nếu bạn không yêu cầu tạo mới mật khẩu , vui lòng bỏ qua mail này.</p>
        <p>Cảm ơn,<br>Shop Kim</p>
      </div>
    </body>
    </html>`;
  };


export const contentHTMLConfirmEmail = (receiver, confirmLink) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận Email</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 50px auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h2 {
        color: #333333;
      }
      p {
        color: #666666;
      }
      a {
        color: #007bff;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Xác Nhận Email Của Bạn</h2>
      <p>Xin chào <b>${receiver}</b>,</p>
      <p>Chúng tôi đã nhận yêu cầu đăng ký tài khoản của bạn. Nhấn vào đường dẫn bên dưới xác nhận email của bạn:</p>
      <p><a href="${confirmLink}">${confirmLink}</a></p>
      <p>Nếu bạn không đăng ký tài khoản , vui lòng bỏ qua mail này.</p>
      <p>Cảm ơn,<br>Shop Kim</p>
    </div>
  </body>
  </html>`;
};