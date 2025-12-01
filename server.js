import dotenv from "dotenv";
import { connect } from "./config/db.js";

// Uncaught Exception HAndler
process.on("uncaughtException", (error) => {
    console.log(`${error.name}: ${error.message}`);
    console.log("Uncaught Exception occurred! shutting down...");
    process.exit(1);
});

import app from "./app.js";
dotenv.config({ path: "./config.env" });

// start the server
const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
    console.log(`Server started in => ${process.env.NODE_ENV} mode.`);;
});

// connect to db
connect(process.env.CON_STR);

// Unhandled Rejection HAndler
process.on("unhandledRejection", (error) => {
    console.log(`${error.name}: ${error.message}`);
    console.log("Unhandled Rejection occurred! shutting down...");
    server.close(() => {
        process.exit(1);
    });
});
