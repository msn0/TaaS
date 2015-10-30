var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 9000});
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://localhost');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.get('/', function (req, res) {
  res.render('client');
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};

wss.on('connection', function connection(ws) {
  console.log('client connected');
});

client.on('connect', function () {
  console.log('connected');
  client.subscribe('WaaS/timer');
});

client.on('message', function (topic, message) {
  console.log(message.toString());

  try {
    wss.broadcast(message.toString());
  } catch(e) {
    console.log("connection error");
  }
});


app.listen(3000);
