var express = require('express');
var app = express();
var server = require('http').Server(app);


app.get('/', function(req, res){

	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

server.listen(2000);
console.log("Listening");

var SOCKET_LIST = {};
var ACTIVE_GAMES = {};

var io = require('socket.io')(server, {});
io.sockets.on('connection', function(socket){
	socket.id = Math.random();

	SOCKET_LIST[socket.id] = socket;
	console.log(socket.id);

	socket.on('createNewRoom', function(data){
		console.log(data.name + " has created a new room");
		var newRoomID = makeRoomID();
		ACTIVE_GAMES[newRoomID] = {data.name};
	})

	socket.on('enterRoom', function(data){
	
		console.log(data.name + " has just joined the room " + data.rID);

	})

	socket.on('disconnect', function(){
		delete SOCKET_LIST[socket.id]
	})

})

var makeRoomID(){
	var text = "";
	var possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	for (var i = 0; i<5; i++){
		text += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
	}
	return text;
}