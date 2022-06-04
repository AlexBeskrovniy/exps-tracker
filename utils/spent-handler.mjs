import { Total } from '../models/total.mjs';
import { Record } from '../models/record.mjs';
import * as stat from './stat-counter.mjs';

export const setTotalSpent = async () => {
    try {
        const allMoney = await Record.find({}, {money: 1, createdAt: 1, _id: 0});

        let total = stat.moneyCounter(allMoney);
        let lastDaySpents  = stat.moneyCounter(stat.getPeriodSpents(allMoney, stat.getPeriodTimestamp(1)));
        let lastWeekSpents  = stat.moneyCounter(stat.getPeriodSpents(allMoney, stat.getPeriodTimestamp(7)));
        let lastMountSpents  = stat.moneyCounter(stat.getPeriodSpents(allMoney, stat.getPeriodTimestamp(30)));
        let lastYearSpents  = stat.moneyCounter(stat.getPeriodSpents(allMoney, stat.getPeriodTimestamp(365)));

		await Total.findOneAndUpdate({ name: 'Total' },
        {
            totalSpent: total,
            lastDaySpents: lastDaySpents,
            lastWeekSpents: lastWeekSpents,
            lastMountSpents: lastMountSpents,
            lastYearSpents: lastYearSpents
        },
        { upsert: true, new: true });
    } catch (err) {
        console.error(err);
    }
}

export const getTotalSpent = async () => {
    try {
        let total = await Total.findOne({ name: 'Total' }, { totalSpent: 1, _id: 0});
        return total.totalSpent;
    } catch (err) {
        console.error(err);
    }
}

export const getStatistics = async () => {
    try {
        let stats = await Total.findOne({ name: 'Total' }, 'lastDaySpents lastMountSpents lastWeekSpents lastYearSpents');
        return stats;
    } catch (err) {
        console.error(err);
    }
}
