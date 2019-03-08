import express from 'express';
import path from 'path';
import compress from 'compression';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';

import secrets from 'config/secrets';

const app = express();
const port = process.env.PORT || 8888;

app.use(compress());
app.use(express.static(path.resolve(__dirname)));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:3000',
}));

app.post('/mail', async (req, res) => {
  console.log(req.body);

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: secrets.email,
      pass: secrets.password,
    }
  });

  // const mailOptions = {
  //   from: '"Website" <name@website.com>',
  //   to: "info@ronnyrook.nl",
  //   subject: "Hello from ronnyrook.nl",
  //   html: "<b>Hello world?</b>" // html body
  // };

  // // send mail with defined transport object
  // const info = await transporter.sendMail(mailOptions)
  // console.log("Message sent: %s", info.messageId);

  res.status(200).send({ response: 'Message was send succesfully.' });
});

app.listen(port, () => {
  console.info(`Listening on port ${port}`);
});
