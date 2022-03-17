import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "bookstore3369@gmail.com", // generated ethereal user
        pass: "grrnnppqfluuymoc", // generated ethereal password
    },
});

export default transporter;