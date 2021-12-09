// server.js
// where your node app starts

// init project
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const rp = require('request-promise');
const app = express();

// Enable Compression
app.use(compression());

// Enable CORS
app.use(cors({ origin: '*' }));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// Keep Glitch from sleeping by periodically sending ourselves a http request
setInterval(function() {
  console.log('Keep Alive');
  rp('https://pipefy-emoji-app.glitch.me')
  .then(() => {
    console.log('Successfully sent request');
  })
  .catch((err) => {
    console.error(`Error sending request ${err.message}`);
  });
}, 150000); // every 2.5 minutes

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
