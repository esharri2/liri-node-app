const keys = require("./keys.js");
const request = require("request");
const twitter = require("twitter");
const spotify = require("node-spotify-api");
const fs = require("fs");

let command = process.argv[2];
let arg = process.argv[3];

if (process.argv[4]) {
  return console.log(`
  Your command has too many arguments.
  If you're asking me about a movie or song, try putting the title in quotes.`);
}

function commandCheck(command) {
  switch (command) {
    case "my-tweets":
      getTweets();
      break;
    case "spotify-this-song":
      getSong(arg);
      break;
    case "movie-this":
      getMovie(arg);
      break;
    case "do-what-it-says":
      doRandom();
      break;
    default:
      console.log("Sorry, I dont understand.");
  }
}

commandCheck(command);

//Get last 20 tweets by owner of the api keys
function getTweets() {
  const client = new twitter(keys.twitterKeys);
  client.get("statuses/home_timeline.json?count=20", function(error, tweets) {
    if (error) throw error;
    var result;
    tweets.forEach(function(item) {
      result+=item.text+`\n`;
      result+=item.created_at+`\n`;
      result+="------"+`\n`;
    });
    logResults(result);
  });
}

//Get information about a song title
function getSong(title) {
  const client = new spotify(keys.spotifyKeys);
  if (!arg) {
    title = "The Sign";
  }
  client.search({ type: "track", query: title }, function(err, data) {
    let items = data.tracks.items;
    if (err) {
      return console.log("Error occurred: " + err);
    }
    if (items.length === 0) {
      console.log(`"${title}" is not a known song title. Try something else.`);
    } else {
      //Get the most popular result, or get "The Sign" if no argument was passed
      let popularity = 0;
      let resultIndex;
      items.forEach(function(item, index) {
        if (arg) {
          if (item.popularity > popularity) {
            resultIndex = index;
            popularity = item.popularity;
          }
        } else {
          if (item.name === "The Sign") {
            resultIndex = index;
          }
        }
      });
      let match = items[resultIndex];
      //Print information about the most popular result
      let result = `"${match.name}" is by the band or artist ${
        match.artists[0].name
      } from the album ${match.album.name}.`;
      logResults(result);
      match.preview_url
        ? console.log(`You can preview it here: ${match.preview_url}`)
        : console.log("Sorry, there is no preview available");
    }
  });
}

function getMovie(title) {
  if (!title) {
    title = "Mr. Nobody";
    console.log(`If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/`)
    console.log(`It's on Netflix!`);
    console.log(`Here is some info about it ...`)
  }
  const request = require("request");
  request(`http://www.omdbapi.com/?t=${title}&apikey=${keys.omdbKey}`, function(
    err,
    response,
    data
  ) {
    let body = JSON.parse(data);

    if (err) {
      return console.log("Error occurred: " + err);
    }
    if (body.Response === "False") {
      console.log(`"${title}" is not a known movie title. Try something else.`);
    } else {
      let result = `
      ${body.Title} was released in ${body.Year}. 
      It has an IMDB rating of ${
        body.imdbRating
      } and a Rotten Tomatoes rating of ${body.Metascore}.
      It was produced in ${body.Country} and the language is ${body.Language}.
      Plot: ${body.Plot}.
      It stars ${body.Actors}.`;
      logResults(result);
    }
  });
}

function doRandom() {
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) throw err;
    let arr = data.split(",");
    arg = arr[1];
    commandCheck(arr[0]);
  });
}

function logResults(data) {
  console.log(data);
  fs.appendFile("log.txt", data, err => {
    if (err) throw err;
  });
}
