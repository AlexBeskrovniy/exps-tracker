import { AlertCard } from './components/AlertComponent.js';

export const setFetchParams = (body, method) => {
    return {
        headers: {
            'Content-Type': 'application/json'
        },
        method: method,
        body: JSON.stringify(body)
    }
}

export const getAlert = (status, model, action) => {
    let alert;
    status ?
    alert = new AlertCard(`${model} has successfully ${action}!`, true) :
    alert = new AlertCard('Something went wrong...', false);
    return alert;
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