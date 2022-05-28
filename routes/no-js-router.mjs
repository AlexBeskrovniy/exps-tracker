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
//Show Form Create Record
    .get('/form-create-record', async (req, res) => {
        const total = await totalSpent();
        const categoriesNames = await Category.find( {}, { name:1, _id:0 });
        res.render('no-js/form-create-record.ejs', {
            categoriesNames: categoriesNames,
            totalSpent: total
        });
    })
//Show Form Create Category
    .get('/form-create-category', async (req, res) => {
        const total = await totalSpent();
        res.render('no-js/form-create-category.ejs', {
            totalSpent: total
        });
    })
//Create Record
    .post('/create-record-no-js', (req, res) => {
        Record.create({...req.body})
        .then(record => {
            res.status(201).redirect('/');
        })
        .catch(
            err => { console.error(err);
            res.status(400).end();
        });
    })
//Create Category
    .post('/create-category-no-js', (req, res) => {
        Category.create({...req.body})
        .then(record => {
            res.status(201).redirect('/categories');
        })
        .catch(
            err => { console.error(err);
            res.status(400).end();
        });
    })
//Show Form Edit Record
    .get('/form-edit-record/:id', async (req, res) => {
        try {
            const editedRecord = await Record.findOne({_id: req.params.id });
            const categoriesNames = await Category.find( {}, { name:1, _id:0 });

            if (!editedRecord) {
              return res.status(400).end();
            }
            const total = await totalSpent();
            res.render('no-js/form-edit-record.ejs', {
                totalSpent: total,
                categoriesNames: categoriesNames,
                editedRecord
            });
          } catch (err) {
            console.error(err);
            res.status(400).end();
          }
    })
//Show Form Edit Category
    .get('/form-edit-category/:id', async (req, res) => {
        try {
            const editedCategory = await Category.findOne({_id: req.params.id });

            if (!editedCategory) {
              return res.status(400).end();
            }
            const total = await totalSpent();
            res.render('no-js/form-edit-category.ejs', {
                totalSpent: total,
                editedCategory
            });
          } catch (err) {
            console.error(err);
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

            res.status(200).redirect('/records');
        } catch (err) {
            console.error(err)
            res.status(400).end()
        }
    })
//Update Category
    .post('/edit-category-no-js', async (req, res) => {
        try {
            const editedCategory = await Category.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true });

            if (!editedCategory) {
            return res.status(400).end()
            }

            res.status(200).redirect('/categories');
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
            
            return res.status(200).redirect('/records');
        } catch (err) {
            console.error(err);
            res.status(400).end();
        }
    })

//Delete Category
    .get('/delete-category-no-js/:id', async (req, res) => {
        try {
            const deleted = await Category.findOneAndRemove({ _id: req.params.id });
        
            if (!deleted) {
            return res.status(400).end();
            }
            
            return res.status(200).redirect('/categories');
        } catch (err) {
            console.error(err);
            res.status(400).end();
        }
    });

export default router;