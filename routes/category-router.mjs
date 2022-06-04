import { Router } from 'express';
import { Category } from '../models/category.mjs';
import { Record } from '../models/record.mjs';
import { getTotalSpent } from '../utils/spent-handler.mjs';

const router = Router();

router
    //Create Category
    .post('/create-category', (req, res) => {
        try {
            const category = new Category({...req.body});
            category.save();
            res.status(201).json({...category._doc});
        } catch (err) {
            console.error(err)
            res.status(400).end();
        }
    })
    // //Update Category
    .put('/edit-category', async (req, res) => {
        try {
            const editedRecord = await Category.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true });

            if (!editedRecord) {
            return res.status(400).end()
            }

            const total = await getTotalSpent();
            res.status(200).json({
                ...editedRecord._doc,
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
            let defaultCategory = await Category.findOne({ name: "Other"});
            
            !defaultCategory ?
            defaultCategory = await Category.create({name: "Other", description: "Default category"}) :
            defaultCategory;

            const deleted = await Category.findOneAndRemove({ _id: req.body.id });
       
            if (!deleted) {
            return res.status(400).end();
            }

            if (deleted.id === defaultCategory.id) {
                defaultCategory = await Category.create({name: "Other", description: "Default category"});
            }
            
            await Record.updateMany({category: deleted._id}, {$set: {category: defaultCategory._id}});
            
            const total = await getTotalSpent();
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