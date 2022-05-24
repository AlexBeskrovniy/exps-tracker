import { Router } from 'express';
import * as fs from 'fs';

const router = Router();

const DB_PATH = 'db/records.json';
//Helpers for routes
const readAllRecords = () => JSON.parse(fs.readFileSync(DB_PATH));

const writeRecordsToFile = (path, array) => {
	fs.writeFileSync(path, JSON.stringify(array, null, '\t'));
}
const totalSpent = () => {
	let records = readAllRecords();
	let total = 0;
	records.map(record => total += +record.money);
	return total;
}

router
  //POST Requests
//Show Form Create
    .get('/form-create', (req, res) => {
        let total = totalSpent();
        res.render('no-js/form-create.ejs', { totalSpent: total });
    })
//Show Form Edit
    .get('/form-edit/:id', (req, res) => {
        let records = readAllRecords();
        let editedRecord = records.find(record => record.date === req.params.id);
        console.log(editedRecord);
        let money, category, description, date;
        ({ money, category, description, date } = editedRecord);
        let record = [money, category, description, date];
        let total = totalSpent();
        res.render('no-js/form-edit.ejs', { 
            totalSpent: total,
            record
        });
    })
//Create
    .post('/create-record', (req, res) => {
        let newRecord = {
            money: req.body.money,
            category: req.body.category,
            description: req.body.description,
            date: Date.parse(req.body.date).toString()
        };
            if (!fs.existsSync(DB_PATH)) {
                fs.writeFileSync(DB_PATH, JSON.stringify([newRecord]));
            } else {
                let records = readAllRecords();
                records.unshift(newRecord);
                writeRecordsToFile(DB_PATH, records);
            }

        res.status(201).redirect('/');
    })
//Update
    .post('/edit-record', (req, res) => {
        if (req.body) {
            let editedRecord = req.body;
            let records = readAllRecords();
            let index = records.findIndex(record => record.date === editedRecord.date );
            records.splice(index, 1, editedRecord);
            writeRecordsToFile(DB_PATH, records);
            let total = totalSpent();

            res.status(201).send( {editedRecord, total} );	
        }
    })
//Delete
    .post('/delete-record', (req, res) => {
        if (req.body.id) {
            let records = readAllRecords();
            let id = req.body.id;
            let newRecords = records.filter(record => record.date !== id);
            writeRecordsToFile(DB_PATH, newRecords);
            let total = totalSpent();

            res.status(201).send( {id, total} );
        }	
    });

export default router