const express = require('express');
const movies = require('./movies.json');
const crypto = require('node:crypto');
const cors = require('cors');

const { validateMovie, validatePartialMovie } = require('./schemas/movies.js');

const app = express();
app.use(express.json());

app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGIN = [
            'http://localhost:8080',
            'http://localhost:3000',
            'http://movies.com'
        ]
        if(ACCEPTED_ORIGIN.includes(origin)){
            return callback(null, true);
        }
        if(!origin){
            return callback(null, true);
        }
        return callback( new Error('Not allowed by CORS') );
    }
}));

app.disable('x-powered-by');

app.get('/movies', (req, res) => {
    const { genre } = req.query;
    if(genre){
        const filterMovie = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        );
        return res.json(filterMovie);
    }
    res.json(movies);
});

app.get('/movies/:id', (req, res) => {
    const { id } = req.params;
    const movie = movies.find(movie => movie.id === id);
    if(movie) return res.json(movie);

    res.status(404).json( {message: 'Movie not Found'} );
});

app.post('/movies', (req, res) => {
    const result = validateMovie(req.body);
    if(result.error){
        return res.status(400).json( {error: JSON.parse(result.error.message)} );
    }

    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    };

    movies.push(newMovie);
    res.status(201).json(newMovie);
});


app.delete('/movies/:id', (req, res) => {
    const { id } = req.params;
    const movieIndex = movies.findIndex(movie => movie.id === id);

    if(movieIndex === -1){
        return res.status(404).json( {message: 'Movie not Found'} );
    }

    movie.splice(movieIndex, 1);
    return res.json( {message: 'Movie Deleted'});
});

app.patch('/movies/:id', (req, res) => {
    const result = validatePartialMovie(req.body);
    if(!result.success){
        return res.status(400).json( {message: JSON.parse(result.error.message)} );
    }

    const { id } = req.params;
    const movieIndex = movies.findIndex(movie => movie.id === id);

    if(movieIndex === -1){
        return res.status(404).json( {message: 'Movie not Found'} );
    }

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }
    
    movies[movieIndex] = updateMovie;
    return res.json(updateMovie);
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
    console.log(`Server to listening on port htttp://localhost:${PORT}`);
});
