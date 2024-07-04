const nodemailer = require("nodemailer");
const asyncHandler=require('express-async-handler')

const sendMail = asyncHandler(async ({ email, html }) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: '"ecommerce" <no-reply@ethereal.email>', // sender address
        to: email,
        subject: "Forgot password", // Subject line
        html: html
    });

    return info;
})

module.exports = {
    sendMail
}