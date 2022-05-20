import express from 'express';
import * as fs from 'fs';

const app = express();
const HOST = 'localhost';
const PORT = 3000;

//Setting body-parser
const jsonParser = express.json();

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
	let records = fs.readFileSync('db/records.json');
	records = JSON.parse(records);
	res.render('all-records.ejs', {records: records});
});

//POST Requests
//Create
app.post('/', jsonParser, (req, res) => {
	if (!req.body) {
		console.log("No data.");
	}
	let newRecord = req.body;
		if (!fs.existsSync('db/records.json')) {
			fs.writeFileSync('db/records.json', JSON.stringify([newRecord]));
			res.status(201).send(newRecord);
		} else {
			let existsRecords = fs.readFileSync('db/records.json')

			existsRecords = JSON.parse(existsRecords);

			existsRecords.unshift(newRecord);
			
			fs.writeFileSync('db/records.json', JSON.stringify(existsRecords, null, '\t'));

			res.status(201).send(existsRecords);
		}
	
});
//Delete
app.post('/all-records', jsonParser, (req, res) => {
	if (req.body.id) {
		let records = fs.readFileSync('db/records.json');
		records = JSON.parse(records);
		let id = req.body.id;

		for (let i = 0; i < records.length; i+=1) {
			if (Number(records[i].date) === Number(id)) {
				records.splice(i, 1);
				fs.writeFileSync('db/records.json', JSON.stringify(records, null, '\t'));
				res.status(201).send(records);	
			}
		}
	}	
});
//Update
app.post('/edit-record', jsonParser, (req, res) => {
	if (req.body) {
		let editedRecord = req.body;
		let records = fs.readFileSync('db/records.json');
		records = JSON.parse(records);

		for (let i = 0; i < records.length; i+=1) {
			if (Number(records[i].date) === Number(editedRecord.date)) {
				records.splice(i, 1, editedRecord);
				fs.writeFileSync('db/records.json', JSON.stringify(records, null, '\t'));
				res.status(201).send(editedRecord);	
			}
		}
	}
});
//Total
app.post('/total', jsonParser, (req, res) => {
	let records = JSON.parse(fs.readFileSync('db/records.json'));
	if (records) {
		let result = 0;
		for (let i = 0; i < records.length; i+=1) {
			result += Number(records[i].money);
		}
		res.status(200);
		res.send({result: result});
	};
});

app.listen(PORT);
console.log(`Server has started on the ${HOST}: ${PORT}`);