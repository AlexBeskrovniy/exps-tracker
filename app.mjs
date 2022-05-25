import express from 'express';
import * as fs from 'fs';

import noJsRouter from './routes/no-js-router.mjs';

const app = express();
const HOST = 'localhost';
const PORT = 3000;
const DB_PATH = 'db/records.json';

//Setting body-parser
app.use(express.json());
app.use(express.urlencoded());

//Setting view engine
app.set('view engine', 'ejs');

app.set('views', './views');

//Public files
app.use(express.static('public'));

//No js
app.use(noJsRouter);

//Helpers for routes
const readAllRecords = () => JSON.parse(fs.readFileSync(DB_PATH));

const writeRecordsToFile = (path, array) => {
	fs.writeFileSync(path, JSON.stringify(array, null, '\t'));
}
const totalSpent = () => {
	let total = 0;
	if (fs.existsSync(DB_PATH)) {
		let records = readAllRecords();
		records.map(record => total += +record.money);
		return total;
	}
	return total;
}

//index page route
app.get('/', (req, res) => {
	let total = totalSpent();
	res.render('index.ejs', { totalSpent: total });
});

//categories page route
app.get('/categories', (req, res) => {
	let total = totalSpent();
	res.render('categories.ejs', { totalSpent: total });
});

//all-records page route
app.get('/all-records', (req, res) => {
	let total = totalSpent();
	if (fs.existsSync(DB_PATH)) {
		let records = readAllRecords();
		return res.render('all-records.ejs', {
			records: records,
			totalSpent: total
		});
	}
	return res.render('all-records.ejs', {
		records: undefined,
		message: "No Data",
		totalSpent: total
	});
});

// //POST Requests
//Create
app.post('/create-record', (req, res) => {
	let newRecord = req.body;
		if (!fs.existsSync(DB_PATH)) {
			fs.writeFileSync(DB_PATH, JSON.stringify([newRecord]));
		} else {
			let records = readAllRecords();
			records.unshift(newRecord);
			writeRecordsToFile(DB_PATH, records);
		}
	let total = totalSpent();

	res.status(201).send( {total} );
});
//Update
app.post('/edit-record', (req, res) => {
	if (req.body) {
		let editedRecord = req.body;
		let records = readAllRecords();
		let index = records.findIndex(record => record.date === editedRecord.date );
		records.splice(index, 1, editedRecord);
		writeRecordsToFile(DB_PATH, records);
		let total = totalSpent();

		res.status(201).send( {editedRecord, total} );	
	}
});
//Delete
app.post('/delete-record', (req, res) => {
	if (req.body.id) {
		let records = readAllRecords();
		let id = req.body.id;
		let newRecords = records.filter(record => record.date !== id);
		writeRecordsToFile(DB_PATH, newRecords);
		let total = totalSpent();

		res.status(201).send( {id, total} );
	}	
});

app.listen(PORT, () => {
	console.log(`Server has started on the ${HOST}: ${PORT}`);
});