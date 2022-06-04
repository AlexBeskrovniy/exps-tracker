"use strict"

export const setTotalSpentToClient = (value) => {
    const totalOutput = document.getElementById('totalOutput');
    totalOutput.innerHTML = value;
}

export const setStatsDataToClient = (data) => {
    const day = document.querySelector('[data-spent-day]');
    const week = document.querySelector('[data-spent-week]');
    const mount = document.querySelector('[data-spent-mount]');
    const year = document.querySelector('[data-spent-year]');

    let {lastDaySpents, lastWeekSpents, lastMountSpents, lastYearSpents} = data;

    day.textContent = lastDaySpents;
    week.textContent = lastWeekSpents;
    mount.textContent = lastMountSpents;
    year.textContent = lastYearSpents;
}

export const getStatsFromServer = async () => {
    try {
        const res = await fetch('/stats', {
            method: 'GET'
        });
        const data = await res.json();
        setStatsDataToClient(data);
    } catch (err) {
        return console.error(err);
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

export const setFetchParams = (body, method) => {
    return {
        headers: {
            'Content-Type': 'application/json'
        },
        method: method,
        body: JSON.stringify(body)
    }
}


// /*************************************************************** */

// import { fetchParams } from "./utils.js";

// const SELECTORS = {
//     deleteBtn: '[data-delete-button]',
//     record: '[data-record]'
// };

// const records = document.querySelectorAll(SELECTORS.record);

// records.forEach(el => setRecord(el))

// function setRecord(element) {    
//     const deleteButton = element.querySelector(SELECTORS.deleteBtn);
//     const id = element.dataset.recordId;
//     deleteButton.addEventListener('click', (e) => handleDeleteRecord(e, element, id))
// }

// async function handleDeleteRecord(e, element, id) {
//     e.preventDefault();
//     await deleteRecord(id);
//     element.remove();
// }

// function deleteRecord(id) {
//     fetch('delete-record', fetchParams({ id }, 'DELETE'))
//         .then(res => res.json())
//         .then(data => console.log('removed'))
// }