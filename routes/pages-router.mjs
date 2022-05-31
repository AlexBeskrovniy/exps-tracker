import { Router } from 'express';
import { Record } from '../models/record.mjs';
import { Category } from '../models/category.mjs';
import { totalSpent } from '../controllers/helpers.mjs';

const router = Router();

router
   //index page route
    .get('/', async (req, res) => {
        try {
            const categoriesNames = await Category.find( {}, { name:1 });
            const total = await totalSpent();
            return res.render('index.ejs', {
                categoriesNames: categoriesNames,
                totalSpent: total
            });
        } catch (err) {
            console.error(err);
            return res.render('index.ejs', {
                categoriesNames: undefined,
                totalSpent: "Error"

            });
        }
    })
    //categories page route
    .get('/categories', async (req, res) => {
        try {
            const categories = await Category.find( {} ).sort( {createdAt: -1} );
            const categoriesNames = await Category.find( {}, { name:1 });
            const total = await totalSpent();
            return res.render('categories.ejs', {
                categories: categories,
                categoriesNames: categoriesNames,
                totalSpent: total
            });
        } catch (err) {
            console.error(err);
            return res.render('categories.ejs', {
                categories: undefined,
                categoriesNames: undefined,
                message: "No Data",
                totalSpent: "Error"
            });
        }
    })
    //records page route
    .get('/records', async (req, res) => {
        try {
            const records = await Record.find( {} ).sort( {createdAt: -1} ).populate('category', 'name');
            records.map(record => {
                !record.category ?
                record.category = { name: "Category was deleted" }:
                record.category;
            });
            //console.log(records);
            const categoriesNames = await Category.find( {}, { name: 1});
            //console.log(categoriesNames);
            const total = await totalSpent();
            return res.render('records.ejs', {
                records: records,
                categoriesNames: categoriesNames,
                totalSpent: total,
                message: "No Data"
            });
        } catch (err) {
            console.error(err);
            return res.render('records.ejs', {
                records: undefined,
                categoriesNames: undefined,
                message: "No Data",
                totalSpent: "Error"
            });
        }
    });

export default router;