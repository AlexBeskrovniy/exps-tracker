"use strict"

//Helpers
function setTotalSpent(value) {
    const totalOutput = document.getElementById('totalOutput');
    totalOutput.setAttribute('value', value);
}

function getTotalSpent() {
   return fetch('/total', {
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => {setTotalSpent(data.total);
                console.log(data.total)
    })
    .catch(err => console.error(err))
}

function createUnit(form, model, modalWindow) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const recordData = new FormData(form);
        fetch(`/create-${model}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(recordData.entries()))
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            //setTotalSpent(data.total);
            bootstrap.Modal.getOrCreateInstance(modalWindow).hide();
        })
        .catch(err => console.error(err))
        getTotalSpent();
    });
}

function showEditFormAndUpdateUnit (form, model, inputs, modalWindow) {
    const editButtons = document.querySelectorAll('[data-edit-button]');
    
    Array.from(editButtons).map(button => {
        button.addEventListener('click', e => {
            e.preventDefault();
            const id = button.dataset.editButton;
            const target = document.querySelector(`[id="${id}"]`);
            inputs.map(input => {
                const inputEl = modalWindow.querySelector(`[name=${input}]`);
                const targetEl = target.querySelector(`[data-${model}-${input}]`);
                input === 'id' ?
                inputEl.value = id :
                inputEl.value = targetEl.textContent.trim(); 
            });
        })
    });
    //Update the Unit   
    form.addEventListener('submit', e => {
        e.preventDefault();
        const formEditData = new FormData(form);
        fetch(`/edit-${model}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(Object.fromEntries(formEditData.entries()))
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const record = document.querySelector(`[id="${data.updatedRecord.id}"]`);
            const elems = inputs.filter(input => input !== 'id');
            elems.map(elem => {
                record.querySelector('[data-record-category]') ?
                record.querySelector('[data-record-category]').innerHTML = data.updatedRecord.category.name : 
                record.querySelector(`[data-${model}-${elem}]`).innerHTML = data.updatedRecord[elem];
            });
            setTotalSpent(data.total);
            bootstrap.Modal.getOrCreateInstance(modalWindow).hide();
        }).catch(err => console.error(err))
    });
}

function deleteUnit(model) {
    const deleteButtons = document.querySelectorAll('[data-delete-button]');

    Array.from(deleteButtons).map(button => {
        button.addEventListener('click', e => {
            e.preventDefault();
            const id = { id: button.dataset.deleteButton };

            fetch(`/delete-${model}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'DELETE',
                body: JSON.stringify(id)
            })
            .then(res => res.json())
            .then(data => {
                const deletedCard = document.querySelector(`[id="${data.id}"]`);
                deletedCard.remove();
                setTotalSpent(data.total);
            }).catch(err => console.error(err))
        })
    });
}

//Create
const recordForm = document.querySelector('[data-record]');
const categoryForm = document.querySelector('[data-category]');

if (recordForm) {
    const modalCreate = document.getElementById('modalFormNewRecord');
    createUnit(recordForm, 'record', modalCreate);
}

if (categoryForm) {
    const modalCreate = document.getElementById('modalFormNewCategory');
    createUnit(categoryForm, 'category', modalCreate);
}
//Update and Delete
const recordWrapper = document.getElementById('record-wrapper');
const categoryWrapper = document.getElementById('category-wrapper');

if (recordWrapper) {
    const modalEdit = document.getElementById("modalFormEditRecord");
    const editForm = modalEdit.querySelector('[data-edit-record]');
    const inputs = ['money', 'description', 'category', 'id'];
    const model = 'record';
    showEditFormAndUpdateUnit (editForm, model, inputs, modalEdit);
    deleteUnit(model);
}

if (categoryWrapper) {
    const modalEdit = document.getElementById("modalFormEditCategory");
    const editForm = modalEdit.querySelector('[data-edit-category]');
    const inputs = ['name', 'description', 'id'];
    const model = 'category';
    showEditFormAndUpdateUnit (editForm, model, inputs, modalEdit);
    deleteUnit(model);
}