//require
require("dotenv").config();
var keys = require("./keys.js");
var request = require("request");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var fs = require("fs");


var command = process.argv[2];
var search = process.argv.splice(3).join("+");
akata();

function akata() {
    switch (command) {
        case "concert-this":
            console.log(search);
            //BiT API ACCESS DATA
            //console.log(keys.bandInTownId);
            var artist = search;
            var bitUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + keys.bandInTownId;
            console.log(bitUrl);
            //BiT Request
            request(bitUrl, function (error, response, body) {
                if (error) { console.log('error:', error) }; // Print the error if one occurred
                var concerts = JSON.parse(body);
                for (var i = 0; i < concerts.length; i++) {
                    var formatedDate = moment(new Date(concerts[i].datetime)).format("MM/DD/YYYY");
                    appendfile(concerts[i].venue.name);
                    appendfile(concerts[i].venue.city + ", " + concerts[i].venue.country);
                    appendfile(formatedDate);
                    appendfile("-----------");
                }
            });
            break;

        case "spotify-this-song":
            console.log(search);
            //spotify node
            var spotifyType = "track";
            var spotifyQuery = search;

            //spotify request
            var spotify = new Spotify(keys.spotify);
            if(!spotifyQuery) spotifyQuery="The Sign";
            spotify.search({ type: spotifyType, query: spotifyQuery }, function (err, data) {
                if (err) {
                    return console.log("error occurred: " + err);
                }
                else {
                    for (i = 0; i < data.tracks.items.length; i++) {
                        var artists = [];
                        for (j = 0; j < data.tracks.items[i].artists.length; j++) {
                            artists.push(data.tracks.items[i].artists[j].name);
                        }
                        appendfile("Artists: " + artists.join(", "));

                        appendfile("Song name: " + data.tracks.items[i].name);
                        appendfile("Spotify Preview: " + data.tracks.items[i].external_urls.spotify);
                        appendfile("Album Name: " + data.tracks.items[i].album.name)
                    }
                }
        });
break;

    case "movie-this":
console.log(search);
//OMBd API ACCESS DATA
//console.log(keys.omdbId);
var movieTitle = search;
if(!movieTitle) movieTitle="Mr. Nobody";
var omdbUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=" + keys.omdbId;
//console.log(omdbUrl);
//OMDB request
request(omdbUrl, function (error, response, body) {
    if (error) { console.log('error:', error) }; // Print the error if one occurred
    var movie = JSON.parse(body);

    appendfile("Title: " + movie.Title);
    appendfile("Year: " + movie.Year);
    appendfile("IMDB Rating: " + movie.Ratings[0].Value);
    appendfile("Rotten Tomatoes Rating: " + movie.Ratings[1].Value);
    appendfile("Country: " + movie.Country);
    appendfile("Language: " + movie.Language);
    appendfile("Plot: " + movie.Plot);
    appendfile("Actors: " + movie.Actors);

});
break;

    case "do-what-it-says":
// The code will store the contents of the reading inside the variable "data"
fs.readFile("random.txt", "utf8", function (error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
        return console.log(error);
    }

    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");
    command = dataArr[0];
    search = dataArr[1];
    akata();

});


break;
}
};

//BONUS
function appendfile(text) {
    // Next, we append the text into the "log.txt" file.
    // If the file didn't exist, then it gets created on the fly.
    fs.appendFile("log.txt", text + "\n", function (err) {

        // If an error was experienced we will log it.
        if (err) {
            console.log(err);
        }
        console.log(text);
    });
}
