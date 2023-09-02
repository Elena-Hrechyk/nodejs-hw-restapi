const nodemailer = require("nodemailer");
require("dotenv").config();

const { META_PASSWORD, FROM_EMAIL } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: FROM_EMAIL,
    pass: META_PASSWORD,
  },
};

const transpoter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = {
    ...data,
    from: FROM_EMAIL,
  };
  await transpoter.sendMail(email);
  return true;
};

module.exports = sendEmail;
