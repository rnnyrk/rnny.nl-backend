import express from 'express';
import path from 'path';
import compress from 'compression';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8888;

app.use(compress());
app.use(express.static(path.resolve(__dirname)));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:3000',
}));

app.post('/mail', (req, res) => {
  console.log(req.body);
  res.status(200);
});

app.listen(port, () => {
  console.info(`Listening on port ${port}`);
});
