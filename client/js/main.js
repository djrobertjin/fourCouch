// var io = require('socket.io-client');
console.log("Hello");
var socket = io();

var roomID = document.getElementById('roomID');
var playerName = document.getElementById('playerName');
var enterRoomButton = document.getElementById('enterRoomButton')
var newRoomButton = document.getElementById('createNewRoomButton')

newRoomButton.onclick = function(){
	socket.emit('createNewRoom', {name: playerName.value});
	console.log("Creating new Room..")
}

enterRoomButton.onclick = function(){
	socket.emit('enterRoom', {name: playerName.value, roomID: roomID.value});
	//socket.emit('enterRoom', roomID.value)
	console.log("Entering room..");

}

socket.on('RoomResponse', function(data){
	console.log(data.roomID);
	document.getElementById('roomIDinfo').innerHTML = data.roomID;
	document.getElementById('playerinfo').innerHTML
});


//////////////////////////////////

//Update DOM elements
function update(gameObj){
	var roomID = document.getElementById('roomIDinfo');
	// for i in gameObj.players{
	// 	roomID.innerHTML += i.personName;
	// }
	roomID.innerHTML = "RoomID: ";
	var players = gameObj.players;
	for (var i = 0; i < players.length; i++){
		console.log(players[i].personName);
		
		roomID.innerHTML += players[i].personName + " ";
	}

	// console.log(players);
	
	// roomID.innerHTML += "boing";
	
	//console.log(roomID);


}