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
	//console.log(socket.id);

// Handle new room event. 
	socket.on('createNewRoom', function(data){
		console.log(data.name + " has created a new room");
		var newRoomID = makeRoomID();
		socket.gameName = data.name;
		socket.join(newRoomID);
		//ACTIVE_ROOMS[newRoomID] = {players: [data.name]}
		addPlayer(data.name, newRoomID, socket.id);
//		console.log(io.sockets.adapter.sids[socket.id][newRoomID]);
		socket.emit('RoomResponse', {roomID: newRoomID});

	})

//
	socket.on('enterRoom', function(data){
		if (io.sockets.adapter.rooms[data.roomID])
		{
			socket.join(data.roomID);
			socket.nickname = data.name;
			socket.hiddenname = data.name;
			//ACTIVE_ROOMS[data.roomID].players.push(data.name);
			addPlayer(data.name, data.roomID, socket.id);

			socket.emit('RoomResponse', {roomID: data.roomID})
			console.log(io.sockets.adapter.sids);
			//io.sockets.emit('playerUpdate', {players: io.sockets.adapter.sids[socket.id]})
			console.log("exists");
		}
		else{ // ********** THROW ERROR ************
			console.log("no exist");
		}
		//console.log(io.sockets.adapter.rooms);
		console.log('server joining room for', socket.id);

		console.log(ACTIVE_ROOMS);
		console.log(ACTIVE_ROOMS[data.roomID].players)
	})

	socket.on('disconnect', function(){
		delete SOCKET_LIST[socket.id]
	})

})


function addPlayer(name, roomID, socketID){
	if (!(ACTIVE_ROOMS[roomID])){
		ACTIVE_ROOMS[roomID] = {players: []};
	}

	ACTIVE_ROOMS[roomID].players.push({personName: name, hiddenName: name, socket_id: socketID});

}

function removePlayer(socketID, roomID){
	var pos = findBySocketID(ACTIVE_ROOMS[roomID].players, socketID);
	ACTIVE_ROOMS[roomID].players.splice(pos, 1);


}

function findBySocketID(arr, id){
	for (var i = 0; i < arr.length; i++){
		if (arr[i].socket_id === id){
			return i;
		}
	}
}

/* Room should have information about roomID for unique identification, state (whether it's new & waiting for players, ready to play, ongoing, or completed)

*/
/*
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
*/
function makeRoomID(){
	var text = "";
	var possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	for (var i = 0; i<5; i++){
		text += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
	}
	return text;
}