var express = require ('express');
var Server = require ('socket.io');
var socket = new Server ();
var app = express ();
app.use(express.static(__dirname))

let number_of_videos = 10;
let comments = [];

for (let i = 0 ; i < number_of_videos ; i += 1)
{
	comments.push ([]);
}

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

app.get ('/data', function (req, res) {
	let id = parseInt (req.query.id);
	console.log (req.query.id);
	res.send (JSON.stringify (comments [id]));
});

app.get ('/', function (req, res) {
	let answer_html = `
	<html>
		<body>
		        <script src='/node_modules/socket.io-client/dist/socket.io.min.js'></script>
				<script>
					var socket = io();
					socket.emit('new_comment', {id: 1, author: 'Alex Tsvetanov', text: 'TTSarq be tuk'});
				</script>
		</body>
	</html>
	`;
	res.send (answer_html);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

