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
var ACTIVE_ROOMS = {};


var io = require('socket.io')(server, {});
io.sockets.on('connection', function(socket){

	SOCKET_LIST[socket.id] = socket;
	console.log(socket.id);

	socket.on('createNewRoom', function(data){
		console.log(data.name + " has created a new room");
		var newRoomID = makeRoomID();
		var newPlayer = data.name;
		var newRoom = new Room(newRoomID);
		newRoom.test();
		newRoom.addPlayer(data.name);
		console.log(newRoom);

		ACTIVE_ROOMS[newRoomID] = newRoom;
		socket.emit('RoomResponse', ACTIVE_ROOMS[newRoomID]);
	})

	socket.on('enterRoom', function(data){
		if (data.rID in ACTIVE_ROOMS){
			//if data.name in ACTIVE_ROOMS[data.RID].players
			console.log(data.name + " has just joined the room " + data.rID);
			var game = ACTIVE_ROOMS[data.rID];
			ACTIVE_ROOMS[data.rID].addPlayer(data.name);
			console.log(ACTIVE_ROOMS[data.rID]);
			io.sockets.emit('RoomResponse', ACTIVE_ROOMS[data.rID])
		}
		else{
			socket.emit('error', {msg: "Room does not exist"});
		}
	})

	socket.on('disconnect', function(){
		delete SOCKET_LIST[socket.id]
	})

})

/* Room should have information about roomID for unique identification, state (whether it's new & waiting for players, ready to play, ongoing, or completed)

*/
function Room(roomID){
	this.roomID = roomID;
	this.state = 0;
	this.lastPerson = null;
	this.players = [];
	this.addPlayer = function(Name){
		this.players.push({socketID: socket.id, personName: Name, hiddenName: Name});
	}
	this.test = function(){
		console.log("Testing");
	}
	this.updateState = function(){
		if (this.state < 3){
			this.state += 1;
		}
		else{
			console.log("Game is completed")
			this.state = 0;
		}
		console.log("updated state:", this.state);
	}

}

function makeRoomID(){
	var text = "";
	var possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	for (var i = 0; i<5; i++){
		text += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
	}
	return text;
}