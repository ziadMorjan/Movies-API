import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    return {
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        photo: payload.picture,
    };
};

export const googleLoginOrSignup = async (googleUser) => {
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
        user = await User.create({
            firstName: googleUser.firstName,
            lastName: googleUser.lastName,
            email: googleUser.email,
            photo: googleUser.photo,
        });
    }

    return user;
};
