import mongoose from 'mongoose';

const totalSchema = new mongoose.Schema({
    name: { type: String, default: "Total"},
    totalSpent: { type: Number, default: 0 }
}, { timestamps: true });

export const Total = mongoose.model('Total', totalSchema, 'totals');