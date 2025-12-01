import nodemailer from "nodemailer";

const sendRestPasswordEmail = async function (details) {
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: details.from,
        to: details.to,
        subject: details.subject,
        text: details.message
    });
}

export {
    sendRestPasswordEmail
};
