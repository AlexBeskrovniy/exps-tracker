import express from 'express';
const app = express();
const HOST = 'localhost';
const PORT = 3000;

//Setting view engine
app.set('view engine', 'ejs');

//Public files
app.use(express.static('public'));

//index page route
app.get('/', (req, res) => {
	res.render('index.ejs');
});

//statistics page route
app.get('/statistics', (req, res) => {
	res.render('statistics.ejs');
});

//categories page route
app.get('/categories', (req, res) => {
	res.render('categories.ejs');
});

//guideline page route
app.get('/guideline', (req, res) => {
	res.render('guideline.ejs');
});

//all-records page route
app.get('/all-records', (req, res) => {
	res.render('all-records.ejs');
});



app.listen(PORT);
console.log(`Server has started on the ${HOST}: ${PORT}`);