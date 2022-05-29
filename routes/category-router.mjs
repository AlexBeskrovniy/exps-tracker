import { Router } from 'express';
import { Category } from '../models/category.mjs';
import { totalSpent } from '../controllers/helpers.mjs';

const router = Router();

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