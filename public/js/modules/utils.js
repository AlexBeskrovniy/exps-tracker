import { AlertCard } from './components/AlertComponent.js';

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

export const formRequestHandler = ({ form, path, method, msg, callback }) => {
    const data = Object.fromEntries(new FormData(form).entries());
    return fetch(path, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: method,
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        callback(data);
        document.body.append(new AlertCard(msg, true));
    })
    .catch(err => {
        console.error(err);
        document.body.append(new AlertCard(err.message, false));
    });  
}