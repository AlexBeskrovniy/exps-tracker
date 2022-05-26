import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
    money: {
        type: Number,
        required: true,
        trim: true,
        maxlength: 20
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 255
    }
}, { timestamps: true });

export const Record = mongoose.model('Record', recordSchema, 'records');