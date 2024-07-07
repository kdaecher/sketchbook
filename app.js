const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(express.static(path.join(__dirname, '/')));

app.listen(PORT, (error) => {
	if (!error) {
    console.log(`App is listening on port ${PORT}`);
  } else {
    console.log('Error occurred, server can\`t start', error);
  }
});
