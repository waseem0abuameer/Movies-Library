"use strict";
const express = require("express");
const movies = require("./ Movie Data/data.json");
const app = express();
const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();
const APIKEY = process.env.APIKEY;
const APIKEY1 = process.env.APIKEY1;
const APIKEY2 = process.env.APIKEY2;
const PORT = process.env.PORT;

function Movies(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

app.get("/", moviesHandler);
app.get("/favorite", favoriteMovies);
app.get("/trending", trendingHandler);
app.get("/search", searchHandler);
app.get("/Popularmovies", PopularmHandler);
app.get("/Popularpeople", peopleHandler);
app.get("*", notFound);

function moviesHandler(req, res) {
    let result = [];
    movies.data.forEach((value) => {
        let oneMovie = new Movies(
            value.id || "N/A",
            value.title,
            value.release_date || "N/A",
            value.poster_path,
            value.overview
        );
        result.push(oneMovie);
    });
    return res.status(200).json(result);
}

function trendingHandler(req, res) {
    let result = [];
    axios
        .get(
            `https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}&language=en-US`
        )
        .then((apiResponse) => {
            apiResponse.data.results.map((value) => {
                let oneMovie = new Movies(
                    value.id,
                    value.title,
                    value.release_date,
                    value.poster_path,
                    value.overview
                );
                result.push(oneMovie);
            });
            return res.status(200).json(result);
        })
        .catch((error) => {
            serverError(error, req, res);
        });
}

function searchHandler(req, res) {
    const search = req.query.search;
    let result = [];
    axios
        .get(
            `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY2}&language=en-US&query=${ search || "spider-man" }&page=2`
        )
        .then((apiResponse) => {
            apiResponse.data.results.map((value) => {
                let oneMovie = new Movies(
                    value.id || "N/A",
                    value.title || "N/A",
                    value.release_date || "N/A",
                    value.poster_path || "N/A",
                    value.overview || "N/A"
                );
                result.push(oneMovie);
            });
            return res.status(200).json(result);
        })
        .catch((error) => {
            serverError(error, req, res);
        });
}

function peopleHandler(req, res) {
    let topRated = [];
    axios
        .get(
            `https://api.themoviedb.org/3/movie/550?api_key=${APIKEY3}`
        )
        .then((value) => {
            value.data.results.forEach((value) => {
                let oneMovie = new Movies(
                    value.id,
                    value.title,
                    value.release_date,
                    value.poster_path,
                    value.overview
                );
                topRated.push(oneMovie);
            });
            return res.status(200).json(topRated);
        })
        .catch((error) => {
            serverError(error, req, res);
        });
}

function PopularmHandler(req, res) {
    let upcoming = [];
    axios
        .get(
            `https://api.themoviedb.org/3/movie/550?api_key=${APIKEY3}`
        )
        .then((value) => {
            value.data.results.forEach((value) => {
                let oneMovie = new Movies(
                    value.id,
                    value.title,
                    value.release_date,
                    value.poster_path,
                    value.overview
                );
                upcoming.push(oneMovie);
            });
            return res.status(200).json(upcoming);
        })
        .catch((error) => {
            serverError(error, req, res);
        });
}


function favoriteMovies(req, res) {
    return res.status(200).send("Welcome to Favorite Page");
}

function notFound(req, res) {
    return res.status(404).send("Requested page isn't found");
}

function serverError(error, req, res) {
    return res.status(500).send({
        status: 500,
        responseText: "Sorry, something went wrong within the local server",
    });
}

app.listen(PORT, () => {
    console.log(`Listen on ${PORT}`);
});