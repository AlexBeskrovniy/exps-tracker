import { Router } from 'express';
import { Record } from '../models/record.mjs';
import { getTotalSpent } from '../utils/spent-handler.mjs';

const router = Router();

router
    //Create Record
    .post('/create-record', async (req, res) => {
        try {
            if(!req.body.category) {
                delete req.body.category;
            }            
            const record =  new Record(req.body);
            
            await record.save();
            await record.populate('category', 'name');
            res.status(201).json({...record._doc});
        } catch (err) {
            console.error(err)
            res.status(400).end();
        }
    })
    //Update Record
    .put('/edit-record', async (req, res) => {
        try {
            if(!req.body.category) {
                delete req.body.category;
            } 
            const editedRecord = await Record.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true }).populate('category', 'name');

            if (!editedRecord) {
                return res.status(400).end()
            }

            res.status(200).json({...editedRecord._doc});
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
            
            return res.status(200).json({id: deleted._id});
        } catch (err) {
            console.error(err);
            res.status(400).end();
        }	
    });

export default router;