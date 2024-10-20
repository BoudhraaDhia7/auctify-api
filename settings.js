import nodemailer from 'nodemailer';

export const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "1e996d3cce0ce7",
    pass: "d24804ae763a78"
  }
});
