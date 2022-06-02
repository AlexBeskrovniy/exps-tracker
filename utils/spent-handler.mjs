import { Total } from '../models/total.mjs';
import { Record } from '../models/record.mjs';

export const setTotalSpent = async () => {
    try {
        const allMoney = await Record.find({}, {money: 1, createdAt: 1, _id: 0});

        let total = 0;
		allMoney.forEach(function(money) {
			total += money.money;
		});

		await Total.findOneAndUpdate({ name: 'Total' }, { totalSpent: total}, { upsert: true, new: true });
    } catch (err) {
        console.error(err);
    }
}

export const getTotalSpent = async () => {
    try{
        let total = await Total.findOne({ name: 'Total' }, { totalSpent: 1, _id: 0});
        return total.totalSpent;
    } catch (err) {
        console.error(err);
    }
}
