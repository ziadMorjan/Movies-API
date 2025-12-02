export default {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
        process.env.NODE_ENV !== "production"
            ? "Lax"
            : "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
