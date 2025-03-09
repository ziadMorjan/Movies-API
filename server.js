const dotenv = require("dotenv");
const db = require("./config/db");

// Uncaught Exception HAndler
process.on("uncaughtException", (error) => {
    console.log(`${error.name}: ${error.message}`);
    console.log("Uncaught Exception occurred! shutting down...");
    process.exit(1);
});

const app = require("./app");
dotenv.config({ path: "./config.env" });

// start the server
let port = process.env.PORT || 8000;
let hostName = process.env.HOST_NAME || "localhost";

let server = app.listen(port, () => {
    console.log(`Mode => ${process.env.NODE_ENV}`);
    console.log(`Server started on => http://${hostName}:${port}`);
});

// connect to db
db.connect(process.env.CON_STR);

// Unhandled Rejection HAndler
process.on("unhandledRejection", (error) => {
    console.log(`${error.name}: ${error.message}`);
    console.log("Unhandled Rejection occurred! shutting down...");
    server.close(() => {
        process.exit(1);
    });
});
