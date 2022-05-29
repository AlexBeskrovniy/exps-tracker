import { Router } from 'express';
import { Record } from '../models/record.mjs';
import { totalSpent } from '../controllers/helpers.mjs';

const router = Router();

router
    //Create Record
    .post('/create-record', (req, res) => {
        Record.create({...req.body})
        .then(async data => {
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