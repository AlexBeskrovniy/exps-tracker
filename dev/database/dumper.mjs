import 'dotenv/config';
import mongoose from 'mongoose';
import { Record } from "../../models/record.mjs";
import { Category } from "../../models/category.mjs";

export const dump = async ([...models]) => {
    try {
        mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, () => {
            console.log('Mongo has connected');
       });
        await Promise.all(models.map(model => model.deleteMany( {} )));
            console.log('Transferred collections were successfully cleared');
        mongoose.connection.close( () => {
            console.log('Mongo has disconnected');
        });
    } catch(err) {
        console.error(err);
    }
}

dump([Record, Category]);