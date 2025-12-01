import mongoes from "mongoose";

export function connect(conStr) {
    mongoes.connect(conStr)
        .then((conn) => {
            console.log("DB connected");
        }).catch((err) => {
            console.log(err);
        });
}
