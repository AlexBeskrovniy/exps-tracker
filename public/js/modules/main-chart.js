import { getInfoForChart, countSpents, setThisMonthSpents, chartInfoHandler } from './statistics.js';

const info = await getInfoForChart();
const thisMonthSpents = countSpents(info);

setThisMonthSpents(thisMonthSpents);

const finalInfo = chartInfoHandler(info);

const ctx = document.getElementById('myChart');

const data = {
labels: finalInfo.labels,
datasets: [
    {
    label: 'This month',
    data: finalInfo.spents,
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

const updateChart = async () => {
    try {
        const info = await getInfoForChart();
        const thisMonthSpents = countSpents(info);

        setThisMonthSpents(thisMonthSpents);

        const updatedInfo = chartInfoHandler(info);

        myChart.data.labels = updatedInfo.labels;
        myChart.data.datasets.forEach(dataset => {
            dataset.data = updatedInfo.spents;
        });
        myChart.update(); 
    } catch (err) {
        console.error(err);
    }
  }

document.addEventListener('record:create', async () => await updateChart());