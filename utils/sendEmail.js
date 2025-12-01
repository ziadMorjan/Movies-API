import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {

    let transporter;

    // =============================
    // 🔵 DEVELOPMENT → Mailtrap
    // =============================
    if (process.env.NODE_ENV === "development") {
        transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });
    }

    // =============================
    // 🔴 PRODUCTION → Gmail SMTP
    // =============================
    else if (process.env.NODE_ENV === "production") {
        transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,        // your gmail
                pass: process.env.GMAIL_APP_PASSWORD // app password
            }
        });
    }

    else {
        throw new Error("Invalid NODE_ENV (must be development or production)");
    }

    // =============================
    // SEND EMAIL
    // =============================
    const mailOptions = {
        from: process.env.MAIL_FROM || process.env.GMAIL_USER,
        to,
        subject,
        html
    };

    return transporter.sendMail(mailOptions);
};
