/*
* Quiz Parser built for MoxQuizz formatted text files
*/

// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
	console.log('Usage: node ' + process.argv[1] + ' FILENAME');
	process.exit(1);
}

var fs = require('fs');
var filename = process.argv[2];

var trivia = {};

// Read the file and print its contents.
function readLines(input, func) {
	var remaining = '';

	input.on('data', function(data) {
		remaining += data;
		console.log(remaining + ' END');
		var index = remaining.indexOf('\n');
		var last = 0;
		while (index > -1) {
			var line = remaining.substring(last, index);
			console.log(line + ' END');
			last = index + 1;
			func(line);
			index = remaining.indexOf('\n', last);
		}

		remaining = remaining.substring(last);
	});

	input.on('end', function() {
		if (remaining.length > 0) {
			func(remaining);
		}
	});
}

function func(data) {
	// console.log('Line: ' + data);
}

var input = fs.createReadStream(filename);
readLines(input, func); 