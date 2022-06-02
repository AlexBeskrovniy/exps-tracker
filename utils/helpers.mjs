// import { Record } from '../models/record.mjs';
// import { Total } from '../models/total.mjs';

// //Helpers for routes
// //Total spent query
// export const totalSpent = async () => {
// 	try {
// 		const allMoney = await Record.find({}, {money: 1, createdAt: 1, _id: 0});
// 		// const lastDayMoney = allMoney.filter(money => Date.parse(money.createdAt) > Date.now() - 86400000);
// 		// const lastWeekMoney = allMoney.filter(money => Date.parse(money.createdAt) > Date.now() - 604800000);
// 		// const lastMounthMoney = allMoney.filter(money => Date.parse(money.createdAt) > Date.now() - 2592000000);
// 		// const lastYearMoney = allMoney.filter(money => Date.parse(money.createdAt) > Date.now() - 31536000000);

// 		let total = 0;
// 		allMoney.forEach(function(money) {
// 			total += money.money;
// 		});
// 		const MONEY = await Total.findOneAndUpdate({ name: 'Total' }, { totalSpent: total}, { upsert: true, new: true });
// 		console.log(MONEY);
// 		return total;
// 	} catch (err) {
// 		console.error(err);
// 	}
// }