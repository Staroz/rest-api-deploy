const zod = require('zod');

const movieSchema = zod.object({
	title: zod.string({
		invalid_type_error: 'Movie title must be a string',
		required_error: 'Movie title is required'
	}),
	year: zod.number().int().min(1900).max(2024),
	director: zod.string(),
	duration: zod.number().int().positive(),
	poster: zod.string().url({
		message: 'Poster must be a valid URL'
	}),
	genre: zod.array(
		zod.enum(['Action', 'Fantasy', 'Comedy', 'Adventure', 'Sci-Fi', 'Horror', 'Adventure', 'Comedy'])),
	rate: zod.number().positive().min(1).max(10).default(2.5)
});

function validateMovie(input) {
	return movieSchema.safeParse(input);
}

function validatePartialMovie(input) {
	return movieSchema.partial().safeParse(input);
}

module.exports = { 
	validateMovie, 
	validatePartialMovie 
};