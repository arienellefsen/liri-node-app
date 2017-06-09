"use strict";
//Create variables to require node packages using const ES6
const keys = require('./keys.js');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');
const fs = require('fs');

//Create variable to hold key for Omdb API
const keyOmdb = '40e9cece';

// Create variables to hold keys for twitter API
const consumerKey = keys.twitterKeys.consumer_key;
const consumerSecret = keys.twitterKeys.consumer_secret;
const tokenKey = keys.twitterKeys.access_token_key;
const tokenKeySecret = keys.twitterKeys.access_token_secret;

const client = new Twitter({
    consumer_key: consumerKey,
    consumer_secret: consumerSecret,
    access_token_key: tokenKey,
    access_token_secret: tokenKeySecret
});

// Create variables to hold keys for Spotity API
const spotify = new Spotify({
    id: '24731bb70e7145a6b5dc739008989597',
    secret: '1799f1c44bce4046a2fc8a80bd2a1099'
});

//Function to listen the arguments passed by command
//If command has only 2 arguments ex: node liri.js my-tweets it set parameter to empty string
//If function has more than 2 arguments ex: node liri.js movie-this gone girl, find undefined and replace with empty string

function init() {
    var extraArg;
    var nodeArgs = process.argv;
    for (var i = 3; i < nodeArgs.length; i++) {
        extraArg = extraArg + " " + nodeArgs[i];
    }
    if (extraArg === undefined) {
        var argCommand = '';
    } else {
        var replaceString = extraArg.replace('undefined', '').trim();
        var argCommand = replaceString;
    }
    liriOptions(process.argv[2], argCommand);
}

//Initialize application
init();

//Using switch case to listen to commands
function liriOptions(command, param) {
    let paramCommand = command + ' ' + param;
    console.log('Param: ' + param);
    console.log('command: ' + command);
    switch (command) {
        case 'my-tweets':
            myTweets();
            saveLog(command);
            break;
        case 'spotify-this-song':
            mySpotify(param);
            saveLog(paramCommand);
            break;
        case 'movie-this':
            myMovie(param);
            saveLog(paramCommand);
            break;
        case 'do-what-it-says':
            randomCommand();
            break;
        default:
            console.log('Sorry, we do not have this option.');
    }
};

//Twitter function, return the last 20 twitters
function myTweets() {
    let count;
    client.get('statuses/home_timeline', count = 20, function(error, tweets, response) {
        if (!error) {
            for (let i in tweets) {
                console.log('Tweet ' + i + ':' + tweets[i].text);
                console.log('Tweet created on ' + i + ':' + tweets[i].created_at);
            }
        }
    })
};

//Spotify function, return songs followed by argument. If there is no song specified retun the song 'The Sign'
function mySpotify(song) {
    if (!song) {
        song = 'The Sign';
    }
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log('Artist: ' + data.tracks.items[0].artists[0].name);
        console.log('Song Name: ' + data.tracks.items[0].name);
        console.log('Spotify Preview Link: ' + data.tracks.items[0].external_urls.spotify);
        console.log('Album: ' + data.tracks.items[0].album.name);
    });
}

//Movie function, return movie followed by argument. If there is no movie specified retun the movie 'Mr. Nobody'
function myMovie(movie) {
    if (!movie) {
        movie = 'Mr. Nobody';
    }
    let omdbApiUrl = 'http://www.omdbapi.com/?t=' + movie + '&apikey=' + keyOmdb + '&y=&plot=full&tomatoes=true&r=json';
    request(omdbApiUrl, function(error, response, body) {
        let movieData = JSON.parse(body);
        console.log('Title: ' + movieData.Title);
        console.log('Year: ' + movieData.Year);
        console.log('IMDB: ' + movieData.imdbID);
        console.log('Country: ' + movieData.Country);
        console.log('Language: ' + movieData.Language);
        console.log('Plot: ' + movieData.Plot);
        console.log('Actors: ' + movieData.Actors);
        console.log('Rotten Tomatoes Rating: ' + movieData.tomatoUserRating);
        console.log('Rotten Tomatoes URL: ' + movieData.tomatoURL);
    });
}

//Function randomCommand execute the command inside of random.txt file
function randomCommand() {
    let readFile = fs.readFileSync('random.txt', 'utf8');
    let commandLiri = readFile.replace(/"/g, ' ').trim();
    let param1 = commandLiri.split(',');
    liriOptions(param1[0], param1[1]);
};

//Function saveLog save all the commands inside of the file log.txt
function saveLog(command) {
    let logCommand = command + '\r\n';
    fs.appendFile('log.txt', logCommand, function(err) {
        if (err) throw err;
        console.log('Log saved!');
    });
}