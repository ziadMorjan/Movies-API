const mongoes = require("mongoose");

function connect(conStr) {
    mongoes.connect(conStr)
        .then((conn) => {
            console.log("DB connected");
        }).catch((err) => {
            console.log(err);
        });
}

module.exports = connect;