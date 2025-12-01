export const resetPasswordTemplate = (resetLink) => {
    return `
    <div style="font-family: Arial; color: #333;">
      <h2>Reset Your Password</h2>
      <p>You requested to reset your password. Click the link below:</p>
      <a href="${resetLink}" 
        style="display:inline-block; padding:10px 20px; 
        background-color:#1e90ff; color:white; 
        text-decoration:none; border-radius:5px;">
        Reset Password
      </a>

      <p>If you didn’t request this, just ignore this email.</p>
      <p>This link will expire in <strong>10 minutes</strong>.</p>

      <hr>
      <p style="font-size:12px; color:#777;">© CimaFlix Platform</p>
    </div>
  `;
};
