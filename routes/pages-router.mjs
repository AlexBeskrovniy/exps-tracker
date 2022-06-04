import { Router } from 'express';
import { Record } from '../models/record.mjs';
import { Category } from '../models/category.mjs';

const router = Router();

router
   //index page route
    .get('/', async (req, res) => {
        try {
            const categoriesNames = await Category.find( {}, { name:1 });
            return res.render('index.ejs', {
                categoriesNames: categoriesNames
            });
        } catch (err) {
            console.error(err);
            return res.render('index.ejs', {
                categoriesNames: undefined,
            });
        }
    })
    //categories page route
    .get('/categories', async (req, res) => {
        try {
            const categories = await Category.find( {} ).sort( {createdAt: -1} );
            const categoriesNames = await Category.find( {}, { name: 1 });
            return res.render('categories.ejs', {
                categories: categories,
                categoriesNames: categoriesNames
            });
        } catch (err) {
            console.error(err);
            return res.render('categories.ejs', {
                categories: undefined,
                categoriesNames: undefined,
                message: "No Data"
            });
        }
    })
    //records page route
    .get('/records', async (req, res) => {
        try {
            const records = await Record.find( {} ).sort( {createdAt: -1} ).populate('category', 'name');
            const categoriesNames = await Category.find( {}, { name: 1});
            return res.render('records.ejs', {
                records: records,
                categoriesNames: categoriesNames,
                message: "No Data"
            });
        } catch (err) {
            console.error(err);
            return res.render('records.ejs', {
                records: undefined,
                categoriesNames: undefined,
                message: "No Data"
            });
        }
    });

export default router;