var ipfsAPI = require('ipfs-api');
var readable = require('stream').Readable
 
var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001');

var express    = require('express');
var bodyParser = require("body-parser");
var app        = express();

app.use(bodyParser.json());

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
  if (req.body.text == null) {
    res.status(400).send('Empty string!');
  }
  
  var text = req.body.text;

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
