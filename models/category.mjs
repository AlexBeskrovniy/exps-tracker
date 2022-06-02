import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 255
    },
    description: {
        type: String,
        required: true,
        maxlength: 255
    }
}, { timestamps: true });

export const Category = mongoose.model('Category', categorySchema, 'categories');