import { Router } from 'express';
import { Record } from '../models/record.mjs';

const router = Router();

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

router
//Show Form Create
    .get('/form-create', async (req, res) => {
        const total = await totalSpent();
        res.render('no-js/form-create.ejs', { totalSpent: total });
    })
//Create Record
    .post('/create-record-no-js', (req, res) => {
        Record.create({
            money: req.body.money,
            category: req.body.category,
            description: req.body.description
        })
        .then(record => {
            res.status(201).redirect('/');
        })
        .catch(
            err => { console.error(err);
            res.status(400).end();
        });
    })
//Show Form Edit
    .get('/form-edit/:id', async (req, res) => {
        try {
            const editedRecord = await Record.findOne({_id: req.params.id });
        
            if (!editedRecord) {
              return res.status(400).end();
            }
            const total = await totalSpent();
            res.render('no-js/form-edit.ejs', {
                totalSpent: total,
                editedRecord
            });
          } catch (e) {
            console.error(e);
            res.status(400).end();
          }
    })
//Update Record
    .post('/edit-record-no-js', async (req, res) => {
        try {
            const editedRecord = await Record.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true });

            if (!editedRecord) {
            return res.status(400).end()
            }

            res.status(200).redirect('/all-records');
        } catch (err) {
            console.error(err)
            res.status(400).end()
        }
    })
//Delete Record
    .get('/delete-record-no-js/:id', async (req, res) => {
        try {
            const deleted = await Record.findOneAndRemove({ _id: req.params.id });
        
            if (!deleted) {
            return res.status(400).end();
            }
            
            return res.status(200).redirect('/all-records');
        } catch (err) {
            console.error(err);
            res.status(400).end();
        }
    });

export default router;