import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

const apiKey = process.env.MAILTRAP_API_KEY;
const isSandbox = process.env.MAILTRAP_USE_SANDBOX === "true";
const inboxId = isSandbox ? Number(process.env.MAILTRAP_INBOX_ID) : undefined;

const client = new MailtrapClient({
    token: apiKey,
    sandbox: isSandbox,
    testInboxId: inboxId,
});

export const sendEmail = async ({ to, subject, html }) => {
    await client.send({
        from: {
            name: "CimaFlix Support",
            email: isSandbox ? "sandbox@example.com" : process.env.MAIL_FROM,
        },
        to: [{ email: to }],
        subject,
        html,
    });
};
