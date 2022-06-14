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

export const setDataToCard = (card, model, attrs) => {
    attrs.map(attr => {
        card.querySelector(`[data-${model}-${attr}]`).textContent = card.getAttribute(attr);
    });
}

export const setValuesToForm = (form, values) => {
    Object.entries(values).map(([key, value]) => {
        form.querySelector(`[name="${key}"]`).value = value;
    });
}

export const doFetch = (data, props, wrapper) => {
    return fetch(props.path, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: props.method,
        body: JSON.stringify(data)
    })
    .then(res => {
        if (res.ok) {
            wrapper.append(new AlertCard(props.msg, res.ok));
        }
        res.json()
        .then(data => {
            props.callback(data);
        })
        .catch(err => {
            console.error(err);
            wrapper.append(new AlertCard(err.message, false));
        })
    });  
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