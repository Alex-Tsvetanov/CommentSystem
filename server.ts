/*
socket.on ('connect', function () {
	console.log ("new connection");

	socket.on ('new_comment', function (data) {
		let comment = data;
		if (comment.id)
		{
			comments [comment.id].push ({author: comment.author, text: comment.text});
		}
		else
		{
			console.log ("Wrong query: " + data);
		}
	});

	socket.on ('disconnect', function () {
		console.log ("new disconnection");
	});
});
*/

var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require("fs");

let number_of_videos = 10;
let comments = [];

for (let i = 0 ; i < number_of_videos ; i += 1)
{
	comments.push ([]);
}

io.on ('connection', function(client){ 
		console.log ("New connection " + client.id);

client.on ('new_comment', function (data) {
	console.log ('recieved ' + data);
	let comment = data;
	if (comment.id)
	{
		comments [comment.id].push ({author: comment.author, text: comment.text});
	}
	else
	{
		console.log ("Wrong query: " + data);
	}
});
});

app.get ('/', function (req, res) {
	let answer_html = `
	<html>
		<body>
		        <script src='/node_modules/socket.io-client/dist/socket.io.js'></script>
				<script>
					var socket = io ();
					socket.on('connect', function(){
						alert (socket.id);
						socket.emit('new_comment', {id: 1, author: 'Alex Tsvetanov', text: 'TTSarq be tuk'});
						alert ("emitted");
					});
				</script>
		</body>
	</html>
	`;
	res.send (answer_html);
});

app.get ('/data', function (req, res) {
	let id = parseInt (req.query.id);
	console.log (req.query.id);
	res.send (JSON.stringify (comments [id]));
});

app.get('*', function (req, res) {
   res.sendFile( __dirname + "/node_modules/socket.io-client/dist/socket.io.js");
})

server.listen(3000);
console.log('"Comment Service" listening on port 3000!');
