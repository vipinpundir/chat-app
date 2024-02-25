const jwt = require("jsonwebtoken")
const { model } = require("mongoose")

const generateTokenAndCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15d'
    })

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "Lax",  // or "None" if using HTTPS and cross-origin
        secure: true,
    })
}

module.exports = generateTokenAndCookie