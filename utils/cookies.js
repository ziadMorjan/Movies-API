const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
        process.env.NODE_ENV !== "production"
            ? "Lax"
            : "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const sendCookieRes = (res, token, statusCode, status, data = null) => {
    res
        .cookie("token", token, cookieOptions)
        .status(statusCode)
        .json({
            status,
            data,
        });
}