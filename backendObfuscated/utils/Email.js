const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const port = parseInt(process.env.EMAIL_PORT, 10) || 587;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: port,
    secure: port === 465, 
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: { 
      rejectUnauthorized: process.env.NODE_ENV === 'production'
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"HomelyHub Stays" <noreply@homelyhub.com>',
    to: options.email,
    subject: options.subject,
    html: options.message 
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(" Email successfully delivered to Mailtrap inbox!");
  } catch (error) {
    console.error("Nodemailer service execution failure: ", error);
    throw new Error("Mailing engine failed to deliver transactional email notification.");
  }
};

module.exports = sendEmail;
