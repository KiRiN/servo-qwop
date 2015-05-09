var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');

var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

// TODO config
var thighsChannel = 1;
var calvesChannel = 2;

setDefaultRotation();
app.listen(8080);
console.log('Please access > http://hogehoge:8080');

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


var devFile = '/dev/servoblaster';
var writeStream = fs.createWriteStream(devFile);

io.sockets.on('connection', function (socket) {
  console.log('connected');
  socket.emit('connected');
  socket.on('rotate', function(data) {
    var thighs = data.thighs;
    var calves = data.calves;

    var thighsMessage = thighsChannel + '=' + data.thighs + '%\n';
    var calvelMessage = calvesChannel + '=' + data.calves + '%\n';
    var message = thighsMessage + calvelMessage;

    writeStream.write(message);
    //console.log(message);

    socket.emit('response', data);
  });
});

io.sockets.on('disconnect', function() {
  console.log('disconnect');
  setDefaultRotation();
});

