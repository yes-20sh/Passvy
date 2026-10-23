export const forgotPasswordTemplate = (
  otp: string,
  name: string = 'User',
): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - Passvy</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #f4f7f6;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #000000;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      letter-spacing: 1px;
    }
    .content {
      padding: 40px 30px;
      color: #333333;
      line-height: 1.6;
    }
    .content h2 {
      font-size: 20px;
      color: #111111;
      margin-top: 0;
    }
    .content p {
      margin: 15px 0;
      font-size: 16px;
    }
    .otp-container {
      text-align: center;
      margin: 35px 0;
    }
    .otp-code {
      display: inline-block;
      padding: 14px 30px;
      background-color: #f4f7f6;
      color: #000000;
      font-weight: bold;
      border-radius: 6px;
      font-size: 24px;
      letter-spacing: 4px;
      border: 1px dashed #cccccc;
    }
    .footer {
      background-color: #f9f9f9;
      padding: 20px;
      text-align: center;
      color: #888888;
      font-size: 14px;
      border-top: 1px solid #eeeeee;
    }
    .footer a {
      color: #000000;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Passvy</h1>
    </div>
    <div class="content">
      <h2>Hello, ${name}</h2>
      <p>We received a request to reset the password for your Passvy account. If you made this request, please use the following OTP (One-Time Password) to complete your password reset:</p>
      <div class="otp-container">
        <span class="otp-code">${otp}</span>
      </div>
      <p>This OTP is valid for 15 minutes. Please do not share this code with anyone.</p>
      <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Passvy. All rights reserved.</p>
      <p>Need help? <a href="mailto:support@passvy.com">Contact Support</a></p>
    </div>
  </div>
</body>
</html>
  `;
};
