import mongoose from 'mongoose';

const totalSchema = new mongoose.Schema({
    totalSpent: { type: Number, default: 0 },
    todaySpent: { type: Number, default: 0 },
    thisWeekSpent: { type: Number, default: 0 },
    thisYearSpent: { type: Number, default: 0 }
}, { timestamps: true });

export const Total = mongoose.model('Total', totalSchema, 'totals');