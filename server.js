const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const conectToDb = require("./config/conectToDb");

// start the server
let port = process.env.PORT || 6000;
let hostName = process.env.HOST_NAME || "localhost";

app.listen(port, hostName, () => {
    console.log("Server started");
});

// connect to db
conectToDb(process.env.CON_STR);
