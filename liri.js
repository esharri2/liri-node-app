const twitterKeys = require("./keys.js");

console.log(twitterKeys);

switch (process.argv[2]) {
  case "my-tweets":
    getTweets();
    break;
  case "spotify-this-song":
    getSong();
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

function getTweets() {
  console.log("here are tweets");
}

function getSong() {
  console.log("song time");
}

function getMovie() {
  console.log("movie time");
}

function doRandom() {
  console.log("rando");
}
