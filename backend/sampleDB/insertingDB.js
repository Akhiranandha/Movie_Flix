const MovieModel = require("../models/models.movies")
const axios = require('axios');
async function demo(){
    const options = {
    method: 'GET',
    url: 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMWFkZGU3ZWQyODU2OGFjYzFhMmU5Y2M3OGEzMjJhNCIsInN1YiI6IjY2NWRhNDQ4N2M0MzFmYzQyYjQ5MWYyZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rFQXCOAyl6mImx9nABlmkXz19a9MuDov-ugRMPMOE78'
    }
    };
    var ids = []
    await axios
    .request(options)
    .then(function (response) {
        // console.log(response.data.results);
        var movies = response.data.results
        movies.forEach(data => {
            ids.push(data.id)
            // print(movieDetails)
        });
    })
    .catch(function (error) {
        console.error(error);
    });

    const apiKey = '21adde7ed28568acc1a2e9cc78a322a4';
    ids.forEach(id => {
        // const movieId = '550';  // Example movie ID for Fight Club
        const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits`;

        fetch(url)
        .then(response => response.json())
        .then(async (data) => {
            const movie=await MovieModel.create({
                movieName: data.title,
                movieUrl: data.homepage,
                moviePosterUrl: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
                movieCast: data.credits.cast.slice(0, 5).map(cast => cast.name),
                genre: data.genres.map(genre => genre.name)[0],
                like:{
                    noOfLikes:0,
                    likedUsers:[]
                },
                comments:[]
            });
            console.log(movie);

        })
        .catch(error => console.error('Error fetching movie details:', error));
    })
}
module.exports = demo
