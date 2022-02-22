'use strict';
const express = require("express");
const movies = require("./data.json");
const app = express();

function Movies(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

app.get('/', moviHandler);
app.get('/favorite', favoritMovies);
app.get('*', nonFound);

function moviHandler(req, res) {
    let result = [];
    movies.data.forEach(value => {
        let oneMovie = new Movies(value.title, value.poster_path, value.overview);
        result.push(oneMovie);
    });
    return res.status(200).json(result);
}

function favoritMovies(req, res) {
    return res.status(200).send("Welcome to Favorite Page");
}

function nonFound(req, res) {
    return res.status(404).send("Requested page isn't found");
}

function serverError(req, res) {
    res.status(500).send({
        "status": 500,
        "responseText": "Sorry, something went wrong within the local server"
    });
}

app.listen(3000, () => {
    console.log("Listen on 3000");
});