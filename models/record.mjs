import mongoose from 'mongoose';
import { setTotalSpent } from '../utils/spent-handler.mjs';

const recordSchema = new mongoose.Schema({
    money: {
        type: Number,
        required: true,
        trim: true,
        maxlength: 20
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    description: {
        type: String,
        required: true,
        maxlength: 255
    },
    createdAt: {
        type: Date,
        default: new Date(Date.now()).toISOString()
    }
}, { timestamps: false, strict: false });

recordSchema.post(['save', 'findOneAndUpdate', 'findOneAndRemove'],  async () => {
    await setTotalSpent();
});

export const Record = mongoose.model('Record', recordSchema, 'records');