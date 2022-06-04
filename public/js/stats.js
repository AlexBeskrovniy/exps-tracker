import { getStatsFromServer } from './modules/utils.js';

window.addEventListener('load', (e) => {
    e.preventDefault();
    getStatsFromServer();
});