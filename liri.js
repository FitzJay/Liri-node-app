

var nodeArgs = process.argv;
var liriInput = nodeArgs[2];

var keyData = require('./keys.js');

var fs = require("fs");
var Twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");



function getTweets (tweetCount) {

	var client = new Twitter({
	  consumer_key: keyData.twitterKeys.consumer_key,
	  consumer_secret: keyData.twitterKeys.consumer_secret,
	  access_token_key: keyData.twitterKeys.access_token_key,
	  access_token_secret: keyData.twitterKeys.access_token_secret
	});

	client.get("statuses/user_timeline", {count: tweetCount}, function(error, tweets, response) {
		if (error) throw error;
			console.log("\nMy last " + tweetCount + " Tweets:");

			for (let i = 0; i < tweetCount; i++) {

				console.log("\nCreated: " + tweets[i].created_at);
				console.log("Tweet text: " + tweets[i].text);

			}
	});

}


function searchSpotify (trackName, itemNum) {
	spotify.search({
		type: "track",
		query: trackName 

	}, function(err, data) {
		if (err) {
			console.log("Error Occured: " + err);
		return;
		}	
		console.log("\nMy Song:");
		console.log("\nArtist Name: " + data.tracks.items[itemNum].album.artists[0].name);
	 	console.log("Song Name: " + data.tracks.items[itemNum].name);
	 	console.log("Preview URL: " + data.tracks.items[itemNum].preview_url);
	 	console.log("Album Name: " + data.tracks.items[itemNum].album.name);

	 });
}

function searchMovie (movieTitle) {

	var queryURL = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&r=json";

	request(queryURL, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			console.log("\nMy Movie: ");
	   			console.log("\nTitle: " + JSON.parse(body).Title);
	   			console.log("Year: " + JSON.parse(body).Year);
	   			console.log("Rated: " + JSON.parse(body).Rated);
	   			console.log("Country: " + JSON.parse(body).Country);
	   			console.log("Language: " + JSON.parse(body).Language);
	   			console.log("Plot: " + JSON.parse(body).Plot);
	   			console.log("Actors: " + JSON.parse(body).Actors);
	   			console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Value);
	   			console.log("URL: https://www.rottentomatoes.com/search/?search=" + movieTitle5);
		}
	});
}

switch (liriInput) {
	case "my-tweets":

		getTweets(20);

	break;

	case "spotify-this-song":

		var songName = "";

		if (nodeArgs.length > 3) {

			for (var i = 3; i < nodeArgs.length; i++) {

				if (i > 3 && i < nodeArgs.length) {

					songName = songName + "+" + nodeArgs[i];

				} else {

					songName += nodeArgs[i];

				}
			}
		} else { 

			searchSpotify("the+sign", 3);
			break;
		}			
			
		searchSpotify(songName, 0);

	break;

	case "movie-this":

		var movieName = "";

			if (nodeArgs.length > 3) {

				for (var i = 3; i < nodeArgs.length; i++) {
						if (i > 3 && i < nodeArgs.length) {

					movieName = movieName + "+" + nodeArgs[i];

				} else {

					movieName += nodeArgs[i];

				}
			}
		} else {
			movieName = "mr+nobody";
		}
	break;

	case "do-what-it-says":

		fs.readFile("random.txt", "utf8", function(error,data) {

		var argArr = data.split(",");

		var commandName = argArr[0];

		var dataArr = argArr[1].split(" ");

		argName = dataArr[0];

		if (dataArr.length > 1) {

			for (var i = 1; i < dataArr.length; i++) {
			 
			 argName = argName + "+"  + dataArr[i];

			} 

		} 

		switch (commandName) {

			case "my-tweets":

				getTweets(20);

			break;

			case "spotify-this-song":

				searchSpotify(argName,0);

			break;

			case "movie-this":

				searchMovie(argName);

			break;

			default:
				console.log("No matching command argument in random.txt file");

		} 

		}); 

	break;

	default:
		console.log("No matching command argument");

}
