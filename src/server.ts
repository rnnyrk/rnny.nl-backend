import express from 'express';
import path from 'path';
import compress from 'compression';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';

import secrets from 'config/secrets.json';

const app = express();
const port = process.env.PORT || 8888;

const whitelist = ['http://localhost:3000', 'https://rnny.nl'];
app.use(cors({
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['POST'],
}));

app.use(compress());
app.use(express.static(path.resolve(__dirname)));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: secrets.host,
  port: 465,
  secure: true,
  auth: {
    user: secrets.email,
    pass: secrets.password,
  },
});

app.get('*', (req, res) => {
  res.status(403).send('<h1>Forbidden</h1><p>You don\'t have permission to access / on this server.</p>');
});

app.post('/mail', async (req, res) => {
  const values = req.body;

  transporter.verify((error: string) => {
    if (error) {
      res.status(500).json({ error: 'Error sending the message' });
    }
  });

  if (values.name && values.email && values.message) {
    const mailOptions = {
      from: `"${values.name}" <${values.email}>`,
      to: secrets.email,
      subject: 'Hello from ronnyrook.nl',
      html: `<h2>Er is een nieuw bericht van ronnyrook.nl</h2>
      <table>
        <tbody>
          <tr>
            <td>Naam</td>
            <td>${values.name}</td>
          </tr>
          <tr>
            <td>E-mail</td>
            <td>${values.email}</td>
          </tr>
          <tr>
            <td>Bericht</td>
            <td>${values.message}</td>
          </tr>
        </tbody>
      </table>`,
    };

    await transporter.sendMail(mailOptions, (error: string) => {
      if (error) {
        res.status(500).json({ error: 'Error sending the message' });
      } else {
        res.status(200).json({ message: 'Message was send succesfully' });
      }
    });
  }
});

app.listen(port, () => {
  console.info(`Listening on port ${port}`);
});
