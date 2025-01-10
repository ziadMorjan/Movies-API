const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

// start the server
let port = process.env.PORT || 6000;
let hostName = process.env.HOST_NAME || "localhost";

app.listen(port, hostName, () => {
    console.log("Server started ...");
    console.log(process.env);
});
