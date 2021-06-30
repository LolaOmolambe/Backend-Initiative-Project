const nodemailer = require("nodemailer");

module.exports = class Email {
  constructor() {
    this.from = `Rental Foods <${process.env.EMAIL_USERNAME}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(subject, template, email) {
    //Send the actual email

    const mailOptions = {
      from: this.from,
      to: email,
      subject,
      html: template,
      //text: template,
    };

    //3.Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }
};
