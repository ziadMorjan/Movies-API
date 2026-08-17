import mongoes from "mongoose";
import { errorLogger } from "../utils/logger.js";

export async function connect(conStr) {
    try {
        if (!conStr) {
            console.error("❌ FATAL: CON_STR (MongoDB connection string) is not defined in environment variables!");
            process.exit(1);
        }
        await mongoes.connect(conStr);
        console.log("✅ DB connected successfully");
    } catch (err) {
        console.error("❌ DB connection failed:", err.message);
        errorLogger(err);
        process.exit(1);
    }
}
