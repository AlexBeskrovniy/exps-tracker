import express from 'express';
import mongoose from 'mongoose';
import { Record } from './models/record.mjs';

const app = express();
const HOST = 'localhost';
const PORT = 3000;

//MongoDB connecting
mongoose.connect('mongodb://localhost/exps-tracker');
const db = mongoose.connection;
db.on('error', err => {
	console.log('error', err)
  });
db.once('open', () => {
	console.log('We are connected to MongoDB')
  });

//Setting body-parser
const jsonParser = express.json();
const urlencodedParser = express.urlencoded();

//Setting view engine
app.set('view engine', 'ejs');

//Public files
app.use(express.static('public'));

//Total spent query
const totalSpent = async () => {
	const allMoney = await Record.find({}, {money: 1, _id: 0}).exec();
	let total = 0;
	allMoney.forEach(function(money) {
		total += money.money;
	});
	return total;
}
const total = await totalSpent();

//index page route
app.get('/', (req, res) => {
	res.render('index.ejs', { total: total });
});

//categories page route
app.get('/categories', (req, res) => {
	res.render('categories.ejs', { total: total });
});

//all-records page route
app.get('/all-records', (req, res) => {
	Record.find({}).sort({ createdAt: -1 }).exec( (err, records)  => {
		if (err) {
			console.log(err);
		}
		res.render('all-records.ejs', {
			records: records,
			total: total 
		});
	});
});

//POST Requests
//Create
app.post('/', jsonParser, (req, res) => {
	if (!req.body) {
		console.log("No data.");
	}
	let newRecord = new Record({
		money: req.body.money,
		category: req.body.category,
		description: req.body.description
	});
	newRecord.save((err, newRecord) => {
		if (err) {
		  console.log('err', err);
		}
		res.status(201).send("OK");
		console.log('Saved record', newRecord);
		
	  });
});

app.listen(PORT, () => {
	console.log(`Server has started on the ${HOST}: ${PORT}`);
});