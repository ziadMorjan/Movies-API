export const resetPasswordTemplate = (resetLink) => `
  <div style="font-family: Arial; color: #333;">
    <h2>Reset Your Password</h2>
    <p>You requested to reset your password. Click the link below:</p>

    <a href="${resetLink}"
      style="padding:10px 20px; background:#1e90ff; color:white;
             text-decoration:none; border-radius:5px;">
      Reset Password
    </a>

    <p>If you didn’t request this, ignore this email.</p>
    <p>This link expires in <strong>10 minutes</strong>.</p>
  </div>
`;
