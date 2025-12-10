import axios from "axios";
import User from "../models/User.js";

export const verifyFacebookToken = async (accessToken) => {
    const fbUrl = `https://graph.facebook.com/me?fields=id,first_name,last_name,email,picture&access_token=${accessToken}`;

    const { data } = await axios.get(fbUrl);

    return {
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        photo: data.picture?.data?.url,
    };
};

export const facebookLoginOrSignup = async (fbUser) => {
    let user = await User.findOne({ email: fbUser.email });

    if (!user) {
        user = await User.create({
            firstName: fbUser.firstName,
            lastName: fbUser.lastName,
            email: fbUser.email,
            photo: fbUser.photo,
            password: Math.random().toString(36).slice(-12),
        });
    }

    return user;
};
