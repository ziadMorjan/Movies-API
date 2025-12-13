import axios from "axios";
import CustomError from "../utils/CustomError.js";
import User from "../models/User.js";

export const verifyFacebookToken = async (accessToken) => {
    try {
        const { data } = await axios.get(
            "https://graph.facebook.com/me",
            {
                params: {
                    access_token: accessToken,
                    fields: "id,name,email,picture",
                },
            }
        );

        if (!data.email) {
            throw new CustomError(
                "Facebook account does not have an email",
                400
            );
        }

        const [firstName, ...rest] = data.name.split(" ");

        return {
            email: data.email,
            firstName,
            lastName: rest.join(" ") || "Facebook",
            photo: data.picture?.data?.url,
        };
    } catch (err) {
        throw new CustomError("Invalid or expired Facebook token", 401);
    }
};

export const facebookLoginOrSignup = async (facebookUser) => {
    let user = await User.findOne({ email: facebookUser.email });

    if (!user) {
        user = await User.create({
            firstName: facebookUser.firstName,
            lastName: facebookUser.lastName,
            email: facebookUser.email,
            photo: facebookUser.photo,
            authProvider: "facebook",
        });

        return user;
    }

    if (user.authProvider === "local") {
        throw new CustomError(
            "This email is registered with password login. Please login using email & password.",
            400
        );
    }

    if (user.authProvider !== "facebook") {
        throw new CustomError(
            `This account uses ${user.authProvider} login.`,
            400
        );
    }

    return user;
};
