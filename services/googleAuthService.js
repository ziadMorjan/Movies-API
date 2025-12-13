import { OAuth2Client } from "google-auth-library";
import CustomError from "../utils/CustomError.js";
import User from "../models/User.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (idToken) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
            clockTolerance: 300,
        });

        const payload = ticket.getPayload();

        if (!payload?.email) {
            throw new CustomError("Google account has no email", 400);
        }

        return {
            email: payload.email,
            firstName: payload.given_name || "Google",
            lastName: payload.family_name || "User",
            photo: payload.picture,
        };
    } catch (err) {
        if (err.message?.includes("Token used too early")) {
            throw new CustomError("Invalid Google token timing", 401);
        }

        if (err.message?.includes("Wrong number of segments")) {
            throw new CustomError("Invalid Google token format", 400);
        }

        throw new CustomError("Invalid or expired Google token", 401);
    }
};

export const googleLoginOrSignup = async (googleUser) => {
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
        user = await User.create({
            firstName: googleUser.firstName,
            lastName: googleUser.lastName,
            email: googleUser.email,
            photo: googleUser.photo,
            authProvider: "google",
        });

        return user;
    }

    if (user.authProvider === "local") {
        throw new CustomError(
            "This email is registered with password login. Please login using email & password.",
            400
        );
    }

    return user;
};
