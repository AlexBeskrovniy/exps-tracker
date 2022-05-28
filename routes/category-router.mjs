import { Router } from 'express';
import { Record } from '../models/record.mjs';
import { Category } from '../models/category.mjs';

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
    //Create Category
    .post('/create-category', (req, res) => {
        Category.create({...req.body})
        .then(async data => {
            const total = await totalSpent();
            res.status(201).send({total});
        })
        .catch(
            err => { console.error(err);
            res.status(400).end();
        });
    })
    // //Update Category
    .put('/edit-category', async (req, res) => {
        try {
            const editedRecord = await Category.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true });

            if (!editedRecord) {
            return res.status(400).end()
            }

            const total = await totalSpent();
            res.status(200).json({
                updatedRecord: {
                    id: editedRecord._id,
                    name: editedRecord.name,
                    description: editedRecord.description
                },
                total: total
            });
        } catch (err) {
            console.error(err)
            res.status(400).end()
        }
    })
    //Delete Category
    .delete('/delete-category', async (req, res) => {
        try {
            const deleted = await Category.findOneAndRemove({ _id: req.body.id });
        
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