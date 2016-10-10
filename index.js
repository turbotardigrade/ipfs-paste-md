var ipfsAPI = require('ipfs-api');
var readable = require('stream').Readable
 
var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001');

var express    = require('express');
var bodyParser = require("body-parser");
var app        = express();

app.use(bodyParser.json());

// for CORS
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/texts/:hash', function (req, res) {
  var hash = req.params.hash;

  ipfs.files.get(hash, function (err, stream) {
    var body = "";
    stream.on('data', (file) => {
      // write the file's path and contents to standard out
      var text = file.content.read().toString();
      res.end(text);
    })
  });
});

app.post('/texts', function (req, res) {
  if (req.body.Text == null) {
    res.status(400).send('Empty string!');
    return;
  }

  var text = req.body.Text;

  var s = new readable;
  s.push(text);
  s.push(null);

  ipfs.util.addFromStream(s, (err, result) => {
    if (err) {
      res.status(500).send(err);
      throw err
    }
    
    res.send({
      Success: true,
      Hash: result[0].hash,
      Size: result[0].size,
    });
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
