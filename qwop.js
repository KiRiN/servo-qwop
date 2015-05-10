var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');

var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

// TODO config
var legs = [ 'front_left', 'front_right', 'back_left', 'back_right' ];
var channels = {
    front_left:  1,
    front_right: 0,
    back_left: 4,
    back_right: 2,
};

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
    console.log(JSON.stringify(data));
    var message = '';
    for (var i = 0; i < legs.length; ++i) {
        leg = legs[i];
        var channel = channels[leg];
        var rot     = data[leg];
        message += channel + '=' + rot + '%\n';
    }

    writeStream.write(message);
    console.log(message);

    socket.emit('response', data);
  });
});

io.sockets.on('disconnect', function() {
  console.log('disconnect');
  setDefaultRotation();
});

