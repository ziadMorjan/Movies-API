const dotenv = require("dotenv");
const app = require("./app");
const db = require("./config/db");

dotenv.config({ path: "./config.env" });

// start the server
let port = process.env.PORT || 8000;
let hostName = process.env.HOST_NAME || "localhost";

app.listen(port, () => {
    console.log(`Mode => ${process.env.NODE_ENV}`);
    console.log(`Server started on => http://${hostName}:${port}`);
});

// connect to db
db.connect(process.env.CON_STR);
