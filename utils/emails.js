const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  auth: {
    user: process.env.NODEMAILER_LOGIN,
    pass: process.env.NODEMAILER_PASS,
  },
});

exports.sendMyTextMail = async (options) => {
  // const { from, to, subject, text } = options;
  await transporter.sendMail(options);
  console.log('Message sent');
};
