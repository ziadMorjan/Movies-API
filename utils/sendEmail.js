import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
    let transporter;

    if (process.env.NODE_ENV === "development") {
        transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });
    } else if (process.env.NODE_ENV === "production") {
        transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });
    } else {
        throw new Error("Invalid NODE_ENV");
    }

    return transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.GMAIL_USER,
        to,
        subject,
        html,
    });
};
