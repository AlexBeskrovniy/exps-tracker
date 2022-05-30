import mongoose from 'mongoose';

const totalSchema = new mongoose.Schema({
    total: { type: Number, default: 0 },
    today: { type: Number, default: 0 },
    thisWeek: { type: Number, default: 0 },
    thisYear: { type: Number, default: 0 }
}, { timestamps: true });

export const Total = mongoose.model('Total', totalSchema, 'totals');