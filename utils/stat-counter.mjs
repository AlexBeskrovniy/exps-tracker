export const getPeriodTimestamp = (dayCount) => {
    let timestamp = 1000 * 60 * 60 * 24 * dayCount;
    return timestamp; 
}

export const moneyCounter = (moneyArray) => {
    let total = 0;
    moneyArray.forEach(function(money) {
        total += money.money;
    });

    return total;
}

export const getPeriodSpents = (moneyArray, timestamp) => {
    return moneyArray.filter(money => Date.parse(money.createdAt) > Date.now() - timestamp);
}