import 'dotenv/config';
import mongoose from 'mongoose';
import { Record } from "../../models/record.mjs";
import { Category } from "../../models/category.mjs";
import { fakeRecords } from "./factories/record-factory.mjs";
import { fakeCategories } from "./factories/category-factory.mjs";

let records = fakeRecords(30);
let categories = fakeCategories(5);

const seeder = async () => {
    await Promise.all(records.map(record => Record.create({...record})));
    await Promise.all(categories.map(category => Category.create({...category})));
}

const seed = async () => {
    try {
        mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, () => {
            console.log('Mongo has connected');
       });
        await seeder();
        console.log('Database successfully seeded');
        mongoose.connection.close( () => {
            console.log('Mongo has disconnected');
        });
    } catch(err) {
        console.error(err);
    }
} 

seed();
    