import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import { connect } from "./config/db.js";
import { errorLogger } from "./utils/logger.js";

// Uncaught Exception Handler
process.on("uncaughtException", (error) => {
    console.error("❌ Uncaught Exception occurred! shutting down...", error);
    errorLogger(error);
    process.exit(1);
});

import app from "./app.js";

// start the server
const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
    console.log(`🚀 Server started on port ${port} in => ${process.env.NODE_ENV || 'production'} mode.`);
});

// connect to db
const dbUri = process.env.CON_STR || process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;
connect(dbUri);

// Unhandled Rejection Handler
process.on("unhandledRejection", (error) => {
    console.error("❌ Unhandled Rejection occurred! shutting down...", error);
    errorLogger(error);
    server.close(() => {
        process.exit(1);
    });
});
