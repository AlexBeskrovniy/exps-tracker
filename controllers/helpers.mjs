import { Record } from '../models/record.mjs';

//Helpers for routes
//Total spent query
export const totalSpent = async () => {
	try {
		const allMoney = await Record.find({}, {money: 1, _id: 0});
		let total = 0;
		allMoney.forEach(function(money) {
			total += money.money;
		});
		return total;
	} catch (err) {
		console.error(err);
	}
}