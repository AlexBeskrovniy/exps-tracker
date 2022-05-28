import express from 'express';
import mongoose from 'mongoose';
import { DB_CONFIG } from './config/db_config.mjs';

import pagesRouter from './routes/pages-router.mjs';
import categoriesRouter from './routes/category-router.mjs';
import recordsRouter from './routes/records-router.mjs';
import noJsRouter from './routes/no-js-router.mjs';

const app = express();
const HOST = 'localhost';
const PORT = 3000;

//MongoDB Connection
mongoose
	.connect(DB_CONFIG, { useNewUrlParser: true })
	.then( () => console.log('Mongo has connected.'))
	.catch(err => console.log(err));

//Setting body-parser
app.use(express.json());
app.use(express.urlencoded());

//Setting view engine
app.set('view engine', 'ejs');

app.set('views', './views');

//Static files
app.use(express.static('public'));

//Routers
app.use(pagesRouter);
app.use(recordsRouter);
app.use(categoriesRouter);
app.use(noJsRouter);


app.listen(PORT, () => {
	console.log(`Server has started on the ${HOST}: ${PORT}`);
});