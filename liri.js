const keys = require("./keys.js");
const request = require("request");
const twitter = require("twitter");
const spotify = require("node-spotify-api");

switch (process.argv[2]) {
  case "my-tweets":
    getTweets();
    break;
  case "spotify-this-song":
    getSong(process.argv[3]);
    break;
  case "movie-this":
    getMovie();
    break;
  case "do-what-it-says":
    doRandom();
    break;
  default:
    console.log("Sorry, I dont understand.");
}

//Get last 20 tweets by owner of the api keys
function getTweets() {
  var client = new twitter(keys.twitterKeys);
  client.get("statuses/home_timeline.json?count=20", function(error, tweets) {
    if (error) throw error;
    tweets.forEach(function(item) {
      console.log(item.text);
      console.log(item.created_at);
      console.log("------");
    });
  });
}

//Get information about a song title
function getSong(title) {
  var client = new spotify(keys.spotifyKeys);
  client.search({ type: "track", query: title }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    if (data.tracks.items.length === 0) {
      return console.log(`"${title}" is not a known song title. Try something else.`);
    } else {
      var match = data.tracks.items[0];
      console.log(
        `"${match.name}" is by the band or artist ${match.artists[0].name} from the album ${match.album.name}.`
      );
      match.preview_url
        ? console.log(`You can preview it here: ${match.preview_url}`)
        : console.log("Sorry, there is no preview available");
    }
  });
}

function getMovie() {
  console.log("movie time");
}

function doRandom() {
  console.log("rando");
}
