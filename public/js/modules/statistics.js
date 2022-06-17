export const setTotalSpentToClient = (value) => {
    const totalOutput = document.getElementById('totalOutput');
    if (value) {
        totalOutput.innerHTML = value;
    }
}

export const setThisMonthSpents = (value) => {
    const dataSpent = document.querySelector('[data-spent]');
    if (dataSpent) {
        dataSpent.innerHTML = value;
    }
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

 export const chartInfoHandler = (data) => {
    const result = data.reduce((accum, curent) => {
        const date = moment(curent.createdAt).format('MMM Do YY');
        if(!accum[date]) {
          accum[date] = curent.money;
        } else {
          accum[date] += curent.money;
        }
        return accum;
      }, {});
    
      const labels = [];
      const spents = [];
      Object.entries(result).map(([ date, money ]) => {
        labels.unshift(date);
        spents.unshift(money);
      });

      return { labels: labels, spents: spents };
 }

export const countSpents = (arr) => {
    let total = 0;
    arr.forEach(function(money) {
        total += money.money;
    });
    return total;
}