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
	let total = 0;
	if (fs.existsSync(DB_PATH)) {
		let records = readAllRecords();
		records.map(record => total += +record.money);
		return total;
	}
	return total;
}

router
//Show Form Create
    .get('/form-create', (req, res) => {
        let total = totalSpent();
        res.render('no-js/form-create.ejs', { totalSpent: total });
    })
//Create Record
    .post('/create-record-no-js', (req, res) => {
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
//Show Form Edit
    .get('/form-edit/:id', (req, res) => {
        let records = readAllRecords();
        let editedRecord = records.find(record => record.date === req.params.id);
        let total = totalSpent();

        res.render('no-js/form-edit.ejs', { 
            totalSpent: total,
            editedRecord
        });
    })
//Update Record
    .post('/edit-record-no-js', (req, res) => {
        if (req.body) {
            let editedRecord = {
                money: req.body.money,
                category: req.body.category,
                description: req.body.description,
                date: req.body.id
            };
            console.log(editedRecord);
            let records = readAllRecords();
            let index = records.findIndex(record => record.date === editedRecord.date );
            records.splice(index, 1, editedRecord);
            writeRecordsToFile(DB_PATH, records);

            res.status(201).redirect('/all-records');	
        }
    })
//Delete Record
    .get('/delete-record-no-js/:id', (req, res) => {
            let records = readAllRecords();
            let id = req.params.id;
            let newRecords = records.filter(record => record.date !== id);
            writeRecordsToFile(DB_PATH, newRecords);

            res.status(201).redirect('/all-records');
    });

export default router;