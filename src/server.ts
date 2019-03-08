import express from 'express';
import path from 'path';
import compress from 'compression';
import bodyParser from 'body-parser';

const app = express();
app.use(compress());
app.use(express.static(path.resolve(__dirname)));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8888;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // res.setHeader('Access-Control-Allow-Credentials', true);

  next();
})

app.post('/mail', (req, res) => {
  console.log(req.body);

  res.status(200);
});

app.listen(port, () => {
  console.info(`Listening on port ${port}`);
});
