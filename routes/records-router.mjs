import { Router } from 'express';
import { Record } from '../models/record.mjs';
import { totalSpent } from '../controllers/helpers.mjs';

const router = Router();

router
    //Create Record
    .post('/create-record', async (req, res) => {
        try {
            const record = await Record.create({...req.body});
            const total = await totalSpent();
            res.status(201).send({total});
        } catch (err) {
            console.error(err)
            res.status(400).end();
        }
    })
    //Update Record
    .put('/edit-record', async (req, res) => {
        try {
            const editedRecord = await Record.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true }).populate('category', 'name');
            
            if (!editedRecord) {
                return res.status(400).end()
            }

            const total = await totalSpent();
            res.status(200).json({
                updatedRecord: {
                    ...editedRecord._doc,
                    id: editedRecord._id
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