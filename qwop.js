var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');

var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

setDefaultRotation();
app.listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

function setDefaultRotation() {
  // TODO
};

io.sockets.on('connection', function (socket) {
  console.log('connected');
  socket.emit('connected');
  socket.on('rotate', function(data) {
    console.log(data);
    socket.emit('response', data);
  });
});

io.sockets.on('disconnect', function() {
  console.log('disconnect');
  setDefaultRotation();
});

