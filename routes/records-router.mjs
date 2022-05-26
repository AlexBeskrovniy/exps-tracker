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
    //Create Record
    .post('/create-record', (req, res) => {
        Record.create({
            money: req.body.money,
            category: req.body.category,
            description: req.body.description
        })
        .then(async record => {
            const total = await totalSpent();
            res.status(201).send({total});
        })
        .catch(
            err => { console.error(err);
            res.status(400).end();
        });
    })
    //Update Record
    .put('/edit-record', async (req, res) => {
        try {
            const editedRecord = await Record.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true });

            if (!editedRecord) {
            return res.status(400).end()
            }

            const total = await totalSpent();
            res.status(200).json({
                updatedRecord: {
                    id: editedRecord._id,
                    money: editedRecord.money,
                    category: editedRecord.category,
                    description: editedRecord.description
                },
                total: total
            });
        } catch (err) {
            console.error(err)
            res.status(400).end()
        }
    })
    //Delete Record
    .delete('/delete-record', async (req, res) => {
        try {
            const deleted = await Record.findOneAndRemove({ _id: req.body.id });
        
            if (!deleted) {
            return res.status(400).end();
            }
            
            const total = await totalSpent();
            return res.status(200).json({
                id: deleted._id,
                total: total
            });
        } catch (err) {
            console.error(err);
            res.status(400).end();
        }	
    });

export default router;