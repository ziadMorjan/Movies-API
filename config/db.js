import mongoes from "mongoose";
import { errorLogger } from "../utils/logger.js";

export async function connect(conStr) {
    try {
        await mongoes.connect(conStr);
        console.log("DB connected");
    } catch (err) {
        errorLogger(err);
        process.exit(1); // 🔥
    }
}
