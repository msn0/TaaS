var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 9000 });
var socket;

wss.on('connection', function connection (ws) {
  socket = ws;
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.get('/', function(req, res, next){
  res.render('client', {"dupa":"foo"});
});

app.get('/talk', function(req, res, next){
  socket.send("stachu");
});

app.listen(3000);