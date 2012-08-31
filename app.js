/*
* Quiz Parser built for MoxQuizz formatted text files
*/

// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
	console.log('Usage: node ' + process.argv[1].split('/').reverse()[0] + ' FILENAME');
	process.exit(1);
}

var fs = require('fs');
var mongoose = require('mongoose');
var filename = process.argv[2];
var Lazy = require('lazy');
var config = require('config');
var trivia = [];
var temp = {};

var db = mongoose.createConnection('mongodb://'+config['MONGO_USER']+':'+config['MONGO_PASS']+'@'+config['MONGO_HOST']+'/'+config['MONGO_DB']);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	var schema = new mongoose.Schema({
		category: {
			type: String,
			trim: true
		},
		question: {
			type: String,
			trim: true
		},
		answer: {
			type: String,
			trim: true
		},
		dateCreated: {
			type: Date,
			'default': Date.now()
		}
	});

	var Question = db.model('Question', schema)

	// Read the file and print its contents.
	var input = fs.createReadStream(filename);

	var lazy = new Lazy(input).lines.map(String).skip(45).forEach(function(line, index) {
		var str = line.trim().match(/(\w*):\s*(.*)/);

		if (str) {
			var key = str[1].toLowerCase();
			var value = str[2];

			temp[key] = value;

			if (key == 'answer') {
				trivia.push(temp);
				Question.create(temp, function(err) {
					if (err)
						throw err;
				});
				// clear temp after answer
				temp = {};
			}
		}
	});

	input.on('end', function() {
		// console.log(trivia);
		// process.exit();
	});

});