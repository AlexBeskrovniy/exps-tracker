import 'dotenv/config';
import mongoose from 'mongoose';
import { Record } from "../../models/record.mjs";
import { Category } from "../../models/category.mjs";
import { fakeRecords } from "./factories/record-factory.mjs";
import { fakeCategories } from "./factories/category-factory.mjs";

const seeder = async (array, model) => {
    await Promise.all(array.map(elem => model.create({...elem})));
}

const getCategoriesId = async () => {
    try {
        let data = await Category.find( {}, { _id: 1 });
        return data;
    } catch (err) {
        console.error(err);
    }  
}

/** In seed function:
 * 1 - Opening DB connection
 * 2 - Creating fake categories
 * 3 - Getting array of the new categories' ids
 * 4 - Creating fake records using array of the categories' ids
 * 5 - Closing DB connection
 */

const seed = async () => {
    try {
        mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.pqimp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true
        }, () => {
            console.log('Mongo has connected');
        });

            let categories = fakeCategories(5);
            await seeder(categories, Category);
            console.log("Categories created");
            let arrayOfId = await getCategoriesId();
            let records = fakeRecords(100, arrayOfId);
            await seeder(records, Record);

        console.log('Database successfully seeded');
        mongoose.connection.close( () => {
            console.log('Mongo has disconnected');
        });
    } catch(err) {
        console.error(err);
    }
} 

seed();
    