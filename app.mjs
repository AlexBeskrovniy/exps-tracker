import express from 'express';
import mongoose from 'mongoose';
import { DB_CONFIG } from './config/db_config.mjs';
import { Record } from './models/record.mjs';

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
app.use(noJsRouter);
app.use(recordsRouter);

//Helpers for routes
//Total spent query
const totalSpent = async () => {
	try {
		const allMoney = await Record.find({}, {money: 1, _id: 0});
		let total = 0;
		allMoney.forEach(function(money) {
			total += money.money;
		});
		return total;
	} catch (err) {
		console.error(err);
	}
}

//index page route
app.get('/', async (req, res) => {
	const total = await totalSpent();
	res.render('index.ejs', { totalSpent: total });
});

//categories page route
app.get('/categories', async (req, res) => {
	const total = await totalSpent();
	res.render('categories.ejs', { totalSpent: total });
});

//all-records page route
app.get('/all-records', async (req, res) => {
	try {
		const records = await Record.find( {} ).sort( {createdAt: -1} );
		const total = await totalSpent();
		return res.render('all-records.ejs', {
			records: records,
			totalSpent: total
		});
	} catch (err) {
		console.error(err);
		return res.render('all-records.ejs', {
			records: undefined,
			message: "No Data",
			totalSpent: total
		});
	}
});

// //Create Record
// app.post('/create-record', (req, res) => {
// 	Record.create({
// 		money: req.body.money,
// 		category: req.body.category,
// 		description: req.body.description
// 	})
// 	.then(async record => {
// 		const total = await totalSpent();
// 		res.status(201).send({total});
// 	})
// 	.catch(
// 		err => { console.error(err);
// 		res.status(400).end();
// 	});
// });
// //Update Record
// app.put('/edit-record', async (req, res) => {
// 	try {
// 		const editedRecord = await Record.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true });

// 		if (!editedRecord) {
// 		  return res.status(400).end()
// 		}

// 		const total = await totalSpent();
// 		res.status(200).json({
// 			updatedRecord: {
// 				id: editedRecord._id,
// 				money: editedRecord.money,
// 				category: editedRecord.category,
// 				description: editedRecord.description
// 			},
// 			total: total
// 		});
// 	} catch (err) {
// 		console.error(err)
// 		res.status(400).end()
// 	}
// });
// //Delete Record
// app.delete('/delete-record', async (req, res) => {
// 	try {
// 		const deleted = await Record.findOneAndRemove({ _id: req.body.id });
	
// 		if (!deleted) {
// 		  return res.status(400).end();
// 		}
		
// 		const total = await totalSpent();
// 	 	return res.status(200).json({
// 			id: deleted._id,
// 			total: total
// 		});
// 	} catch (err) {
// 		console.error(err);
// 		res.status(400).end();
// 	  }	
// });

app.listen(PORT, () => {
	console.log(`Server has started on the ${HOST}: ${PORT}`);
});