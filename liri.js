const keys = require('./keys.js');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');
const fs = require('fs');
let keyOmdb = '40e9cece';

//Get keys
const consumerKey = keys.twitterKeys.consumer_key;
const consumerSecret = keys.twitterKeys.consumer_secret;
const tokenKey = keys.twitterKeys.access_token_key;
const tokenKeySecret = keys.twitterKeys.access_token_secret;

var client = new Twitter({
    consumer_key: consumerKey,
    consumer_secret: consumerSecret,
    access_token_key: tokenKey,
    access_token_secret: tokenKeySecret
});

var spotify = new Spotify({
    id: '24731bb70e7145a6b5dc739008989597',
    secret: '1799f1c44bce4046a2fc8a80bd2a1099'
});

function userInput() {
    for (var i = 2; i < process.argv.length; i++) {
        var action = process.argv[i];
        console.log(action);
        liriOptions(action);
    }
}

function liriOptions(action) {
    var song = 'I Want it That Way';
    var movie = 'Batman';
    switch (action) {
        case 'my-tweets':
            myTweets();
            break;
        case 'spotify-this-song':
            mySpotify(song);
            break;
        case 'movie-this':
            myMovie(movie);
            break;
        case 'do-what-it-says':
            randomCommand();
            break;
        default:
            console.log('Sorry, we do not have this option');
    }
};

function myTweets() {
    client.get('statuses/home_timeline', count = 20, function(error, tweets, response) {
        if (!error) {
            for (var i in tweets) {
                console.log("Tweet " + i + ":" + tweets[i].text);
                console.log("Tweet created on " + i + ":" + tweets[i].created_at);
            }
        }
    })
};


function mySpotify(song) {
    if (!song) {
        song = 'The Sign';
    }
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Song Name: " + data.tracks.items[0].name);
        console.log("Spotify Preview Link: " + data.tracks.items[0].external_urls.spotify);
        console.log("Album: " + data.tracks.items[0].album.name);
    });
}

function myMovie(movie) {
    if (!movie) {
        movie = 'Mr. Nobody';
    }
    var omdbApiurl = 'http://www.omdbapi.com/?i=tt3896198&apikey=' + keyOmdb + '&s=' + movie + "&tomatoes=true&r=json";
    request(omdbApiurl, function(error, response, body) {
        var movieData = JSON.parse(body);
        console.log(movieData);
        console.log("Title: " + movieData.Search[0].Title);
        console.log("Year: " + movieData.Search[0].Year);
        console.log("IMDB: " + movieData.Search[0].imdbID);
        console.log("Country: " + movieData.Search[0].Country);
        console.log("Language: " + movieData.Search[0].Language);
        console.log("Plot: " + movieData.Search[0].Plot);
        console.log("Actors: " + movieData.Search[0].Actors);
        console.log("Rotten Tomatoes Rating: " + movieData.Search[0].tomatoUserRating);
        console.log("Rotten Tomatoes URL: " + movieData.Search[0].tomatoURL);
    });
}

function randomCommand() {
    var readFile = fs.readFileSync('random.txt', 'utf8');
    var commandLiri = readFile.replace(/"/g, " ").trim();
    var formatCommand = commandLiri.replace(/,/g, "").trim();
    console.log(formatCommand);
}
userInput();