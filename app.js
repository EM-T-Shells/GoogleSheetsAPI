const express = require('express');
const bodyParser = require('body-parser');
const api = require('./api.js'); 

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Use the submitToGoogleSheet function from api.js
app.post('/submit', api.submitToGoogleSheet);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

