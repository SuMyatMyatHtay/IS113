const express = require("express");
const router = express.Router();

// ADD YOUR CODE BELOW
router.get("/movies", async (req, res) => {
    let movies = []
    
    const MovieCategory = req.query.category ? req.query.category : "popular";

    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${MovieCategory}?api_key=${process.env.API_KEY}`
        );
        const data = await response.json();
        movies = data.results;
    } catch (error) {
        console.log("Error has occured");
    }
    res.render("movies", { movies })
});

router.get("/details", async (req, res) => {
    let movie = {};
    const movieID = req.query.id;

    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}?api_key=${API_KEY}`);
        const data = await response.json();
        movie = data;
    } catch (error) {
        console.log("Error has occured");
    }
    res.render("movieDetails", {movie})
});


// END OF ADDING YOUR CODE

module.exports = router;
