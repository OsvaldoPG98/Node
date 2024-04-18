import express, { json } from 'express';
import { moviesRouter } from './routes/movies.js';
import { corsMiddleware } from './middleware/cors.js';

const app = express();

app.use(json());

app.use(corsMiddleware());
app.disable('x-powered-by');

app.use('/movies', moviesRouter); // -> /movies, cargara todas las rutas

const PORT  = process.env.PORT ?? 3000;

app.listen(PORT, () => {
    console.log(`Server to listening on port http://localhost:${PORT}`);
});
