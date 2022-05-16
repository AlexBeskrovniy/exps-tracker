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

//categories page route
app.get('/categories', (req, res) => {
	res.render('categories.ejs');
});

//all-records page route
app.get('/all-records', (req, res) => {
	res.render('all-records.ejs');
});

app.get('/create', (req, res) => {
	res.render('create-record.ejs');
});


app.listen(PORT);
console.log(`Server has started on the ${HOST}: ${PORT}`);