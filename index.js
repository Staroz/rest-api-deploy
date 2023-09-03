const express = require('express');
const crypto = require('node:crypto');
const movies = require('./json/movies.json');
const {validateMovie, validatePartialMovie} = require('./schema/movies.schema.js');



const app = express();

app.disable('x-powered-by');
app.use(express.json());



app.get('/', (req, res)=> {
	res.send('<h1> WELCOME MY HOMEPAGE</h1>');
});

app.get('/movies', (req, res)=> {
	res.header('Access-Control-Allow-Origin', '*');
	const {genre} = req.query;

	if (genre) {
		const filteredMovies = movies.filter(
			movie=> movie.genre.some(g=> g.toLowerCase() === genre.toLowerCase()));
		if (filteredMovies.length >= 1) return res.json(filteredMovies);
		res.status(404).send('<h1> GENRE NOT FOUNDED </h1>');	
	}
	res.json(movies);
});

app.get('/movies/:id', (req, res)=> {
	const { id } = req.params;
	const movie = movies.find(movie => movie.id === id);
	if (movie) return res.json(movie);
	res.status(404).send('<h1> MOVIE NOT FOUNDED </h1>');
});

app.post('/movies', (req, res) => {

	const result = validateMovie(req.body);
	console.log(result);
	if (result.error) {
		return res.status(400).json({error: JSON.parse(result.error.message)});
	}
	const newMovie = {
		id: crypto.randomUUID(),
		...result.data
	};
	movies.push(newMovie);
	res.status(201).json(newMovie);
});

app.patch('/movies/:id', (req, res) => {

	const result = validatePartialMovie(req.body);
	console.log(result);

	if(result.error) {
		return res.status(400).json({error: JSON.parse(result.error.message)});
	}
	const { id } = req.params;
	const indexId = movies.findIndex(x=> x.id ===id);
	if (indexId ===-1) {
		res.status(400).send('<h1> ID NOT FOUNDED </h1>');
	}
	const updateMovie = {
		...movies[indexId],
		...result.data
	};
	movies[indexId] = updateMovie;
	return res.json(updateMovie);
});

app.delete('/movies/:id',  (req, res) => {
	res.header('Access-Control-Allow-Origin', '*');
	const { id } = req.params;
	const indexId = movies.findIndex(x=> x.id === id); 
	if (indexId===-1) {
		return res.status(400).send('<h1> ID NOT FOUNDED </h1>');
	}
	const movieDeleted = movies[indexId];
	movies.splice(indexId, 1);
	return res.status(200).json(movieDeleted);
});

app.options('/movies/:id',  (req, res) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
	res.send(200);

});

const PORT = process.env.PORT ?? 3001;

app.listen(PORT, () => {
	console.log(`The Api is on port ${PORT}`);
});

