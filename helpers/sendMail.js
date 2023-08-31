const nodemailer = require("nodemailer");
require("dotenv").config();

const { META_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "olena_hrechykhina@meta.ua",
    pass: META_PASSWORD,
  },
};

const transpoter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = {
    ...data,
    from: "olena_hrechykhina@meta.ua",
  };
  await transpoter.sendMail(email);
  return true;
};

module.exports = sendEmail;
