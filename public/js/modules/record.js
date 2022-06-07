"use strict"

import { setFetchParams, getTotalSpentFromServer, getStatsFromServer } from "./utils.js";

export const recordForm = document.querySelector('[data-record]');
export const wrapper = document.querySelector('#temp-wrapper');
//Create Record
export const createRecord = () => {
    const modalCreate = document.getElementById('modalFormNewRecord');
    const recordTemp = document.querySelector('#record-temp');

    recordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const recordData = new FormData(recordForm);

        fetch('/create-record', setFetchParams(Object.fromEntries(recordData.entries()), 'POST'))
        .then(res => res.json())
        .then(data => {
            const tempClone = recordTemp.content.firstElementChild.cloneNode(true);
            tempClone.dataset.recordDiv = data._id;
            tempClone.querySelector('[data-record-date]').textContent = new Date(data.createdAt).toDateString();
            tempClone.querySelector('[data-record-category]').textContent = data.category.name;
            tempClone.querySelector('[data-record-money]').textContent = data.money;
            tempClone.querySelector('[data-record-description]').textContent = data.description;
            let editBtn = tempClone.querySelector('[data-edit-button]');
            editBtn.dataset.editButton = data._id;
            editBtn.setAttribute('href', `form-edit-category/${data._id}`);
            let deleteBtn = tempClone.querySelector('[data-delete-button]');
            deleteBtn.dataset.deleteButton = data._id;
            deleteBtn.setAttribute('href', `delete-category-no-js/${data._id}`);

            wrapper.prepend(tempClone);

            bootstrap.Modal.getOrCreateInstance(modalCreate).hide();
            getTotalSpentFromServer();
            getStatsFromServer();
        })
        .catch(e => console.error(e))
    });
}

//Show Edit Form and Update Record
export const updateRecord = () => {
    const modalEdit = document.getElementById("modalFormEditRecord");
    const editForm = modalEdit.querySelector('[data-edit-record]');
    const inputs = ['money', 'description', 'category', 'id'];
        
    wrapper.addEventListener('click', e => {
        e.preventDefault();

        let eventTarget = e.target;
        if (eventTarget.closest('[data-edit-button]')) {
            const id = eventTarget.closest('[data-edit-button]').dataset.editButton;
            const target = document.querySelector(`[data-record-div="${id}"]`);
            inputs.map(input => {
                const inputEl = modalEdit.querySelector(`[name=${input}]`);
                const targetEl = target.querySelector(`[data-record-${input}]`);
                input === 'id' ?
                inputEl.value = id :
                inputEl.value = targetEl.textContent.trim();
            });
        }
    });
    //Update the Record   
    editForm.addEventListener('submit', e => {
        e.preventDefault();
        const formEditData = new FormData(editForm);
        fetch('/edit-record', setFetchParams(Object.fromEntries(formEditData.entries()), 'PUT'))
        .then(res => res.json())
        .then(data => {
            const card = document.querySelector(`[data-record-div="${data._id}"]`);

            card.querySelector('[data-record-category]').innerHTML = data.category.name; 
            card.querySelector('[data-record-money').innerHTML = data.money;
            card.querySelector('[data-record-description').innerHTML = data.description;

            bootstrap.Modal.getOrCreateInstance(modalEdit).hide();
            getTotalSpentFromServer();
            getStatsFromServer();
        }).catch(err => console.error(err))
    });
}

//Delete Record
export const deleteRecord = () => {
    wrapper.addEventListener('click', (e) => {
        e.preventDefault();
    
        let eventTarget = e.target;
        if (eventTarget.closest('[data-delete-button]')) {
            const id = { id: eventTarget.closest('[data-delete-button]').dataset.deleteButton };
    
            fetch('/delete-record', setFetchParams(id, 'DELETE'))
            .then(res => res.json())
            .then(data => {
                const deletedCard = document.querySelector(`[data-record-div="${data.id}"]`);
                deletedCard.remove();
                getTotalSpentFromServer();
                getStatsFromServer();
            }).catch(e => console.error(e));
        }
    });
}

// export const record = {
//     recordForm: recordForm,
//     tempWrapper: wrapper,
//     create: createRecord,
//     update: updateRecord,
//     delete: deleteRecord
// };