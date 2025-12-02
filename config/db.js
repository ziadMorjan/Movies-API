import mongoes from "mongoose";
import { errorLogger } from "../utils/logger.js";

export function connect(conStr) {
    mongoes.connect(conStr)
        .then((conn) => {
            console.log("DB connected");
        }).catch((err) => {
            errorLogger(err);
        });
}
