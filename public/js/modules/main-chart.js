import { getInfoForChart, countSpents, setThisMonthSpents } from './statistics.js';

const info = await getInfoForChart();
const thisMonthSpents = countSpents(info);

setThisMonthSpents(thisMonthSpents);

const result = info.reduce((accum, curent) => {
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

const ctx = document.getElementById('myChart');

const data = {
  labels: labels,
  datasets: [
    {
      label: 'This month',
      data: spents,
      backgroundColor: 'rgb(234, 162, 26)',
      borderColor: 'rgb(234, 162, 26)'
    }
  ]
};

const config = {
    type: 'bar',
    data: data,
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Spents'
        },
      },
      responsive: true,
      interaction: {
        intersect: false
      }
    }
  };
const myChart = new Chart(ctx, config);