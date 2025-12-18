export const resetPasswordTemplate = (resetLink) => `
  <div style="
    font-family: Arial, Helvetica, sans-serif;
    background-color: #0f172a;
    padding: 40px 20px;
    color: #e5e7eb;
  ">
    <div style="
      max-width: 520px;
      margin: 0 auto;
      background-color: #020617;
      border-radius: 12px;
      padding: 30px;
      border: 1px solid #1e293b;
    ">
      <!-- Logo / App Name -->
      <h1 style="
        text-align: center;
        color: #e50914;
        margin-bottom: 10px;
      ">
        Movies App
      </h1>

      <p style="
        text-align: center;
        font-size: 14px;
        color: #94a3b8;
        margin-bottom: 30px;
      ">
        Unlimited Movies & Series
      </p>

      <!-- Content -->
      <h2 style="color: #e5e7eb;">Reset your password</h2>

      <p style="font-size: 14px; line-height: 1.6;">
        We received a request to reset your password.
        Click the button below to create a new one.
      </p>

      <!-- Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}"
          style="
            display: inline-block;
            padding: 12px 24px;
            background-color: #e50914;
            color: #e5e7eb;
            text-decoration: none;
            font-weight: bold;
            border-radius: 8px;
          ">
          Reset Password
        </a>
      </div>

      <p style="font-size: 13px; color: #94a3b8;">
        This link will expire in <strong>10 minutes</strong>.
        If you didn’t request a password reset, you can safely ignore this email.
      </p>

      <hr style="
        border: none;
        border-top: 1px solid #1e293b;
        margin: 30px 0;
      " />

      <p style="
        font-size: 12px;
        color: #64748b;
        text-align: center;
      ">
        © ${new Date().getFullYear()} Movies App. All rights reserved.
      </p>
    </div>
  </div>
`;
