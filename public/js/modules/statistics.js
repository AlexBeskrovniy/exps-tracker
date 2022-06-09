export const setTotalSpentToClient = (value) => {
    const totalOutput = document.getElementById('totalOutput');
    totalOutput.innerHTML = value;
}

export const setThisMonthSpents = (value) => {
    const dataSpent = document.querySelector('[data-spent]');
    dataSpent.innerHTML = value;
}

export const getTotalSpentFromServer = async () => {
    try {
        const res = await fetch('/total', {
            method: 'GET'
        });
        const data = await res.json();
        setTotalSpentToClient(data.total);
    } catch (err) {
        return console.error(err);
    }
 }

 export const getInfoForChart = async () => {
     try {
        const res = await fetch('/infochart', {
            method: 'GET'
        });
        const data = await res.json();
        return data;
     } catch (err) {
         console.error(err);
     }
 }

export const countSpents = (arr) => {
    let total = 0;
    arr.forEach(function(money) {
        total += money.money;
    });
    return total;
}