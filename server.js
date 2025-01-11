const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const mongoes = require("mongoose");

// connect to db
mongoes.connect(process.env.CON_STR/* , {
    useNewUrlParser: true
} */).then((conn) => {
    console.log("DB connected");
}).catch((err) => {
    console.log(err);
});

// start the server
let port = process.env.PORT || 6000;
let hostName = process.env.HOST_NAME || "localhost";

app.listen(port, hostName, () => {
    console.log("Server started");
});
