"use strict"
//Helpers
function setTotalSpent(value) {
    const totalOutput = document.getElementById('totalOutput');
    totalOutput.setAttribute('value', value);
}
//Create Record
const recordForm = document.querySelector('[data-record]');
const modalCreate = document.getElementById('modalFormNewRecord');

if (recordForm) {
    recordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const recordData = new FormData(recordForm);

        fetch('/create-record', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(recordData.entries()))
        })
        .then(res => res.json())
        .then(data => {
            setTotalSpent(data.total);
            bootstrap.Modal.getOrCreateInstance(modalCreate).hide();
        })
        .catch(err => console.error(err))
    });
}
//Update Record
const wrapper = document.getElementById('record-wrapper');
//Show Edit Form
if (wrapper) {
    const editButtons = document.querySelectorAll('[data-edit-button]');
    const modalEdit = document.getElementById("modalFormEditRecord");
    const inputs = ['money', 'description', 'category', 'id'];
    const editForm = modalEdit.querySelector('[data-edit-record]');

    Array.from(editButtons).map(button => {
        button.addEventListener('click', e => {
            e.preventDefault();
            const id = button.dataset.editButton;
            const target = document.querySelector(`[id="${id}"]`);
            inputs.map(input => {
                const inputEl = modalEdit.querySelector(`[name=${input}]`);
                const targetEl = target.querySelector(`[data-record-${input}]`);
                input === 'id' ?
                inputEl.value = id :
                inputEl.value = targetEl.textContent.trim(); 
            });
        })
    });
//Update the Record    
    editForm.addEventListener('submit', e => {
        e.preventDefault();
        const formEditData = new FormData(editForm);
        fetch('/edit-record', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(Object.fromEntries(formEditData.entries()))
        })
        .then(res => res.json())
        .then(data => {
            const record = document.querySelector(`[id="${data.updatedRecord.id}"]`);
            const elems = ['category', 'money', 'description'];
            elems.map(elem => {
                record.querySelector(`[data-record-${elem}]`).innerHTML = data.updatedRecord[elem];
            });
            setTotalSpent(data.total);
            bootstrap.Modal.getOrCreateInstance(modalEdit).hide();
        }).catch(err => console.error(err))
    });

    //Delete Record
    const deleteButtons = document.querySelectorAll('[data-delete-button]');

    Array.from(deleteButtons).map(button => {
        button.addEventListener('click', e => {
            e.preventDefault();
            const id = { id: button.dataset.deleteButton };

            fetch('/delete-record', {
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


//Create Category
const categoryForm = document.querySelector('[data-category]');
const modalCreateCategory = document.getElementById('modalFormNewCategory');

if (categoryForm) {
    categoryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const recordData = new FormData(categoryForm);

        fetch('/create-category', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(recordData.entries()))
        })
        .then(res => res.json())
        .then(data => {
            setTotalSpent(data.total);
            bootstrap.Modal.getOrCreateInstance(modalCreateCategory).hide();
        })
        .catch(err => console.error(err))
    });
}
//Update Category
const categoryWrapper = document.getElementById('category-wrapper');
//Show Edit Form
if (categoryWrapper) {
    const editButtons = document.querySelectorAll('[data-edit-button]');
    const modalEdit = document.getElementById("modalFormEditCategory");
    const inputs = ['name', 'description', 'id'];
    const editForm = modalEdit.querySelector('[data-edit-category]');

    Array.from(editButtons).map(button => {
        button.addEventListener('click', e => {
            e.preventDefault();
            const id = button.dataset.editButton;
            const target = document.querySelector(`[id="${id}"]`);
            inputs.map(input => {
                const inputEl = modalEdit.querySelector(`[name=${input}]`);
                const targetEl = target.querySelector(`[data-category-${input}]`);
                input === 'id' ?
                inputEl.value = id :
                inputEl.value = targetEl.textContent.trim(); 
            });
        })
    });
//Update the Category    
    editForm.addEventListener('submit', e => {
        e.preventDefault();
        const formEditData = new FormData(editForm);
        fetch('/edit-category', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(Object.fromEntries(formEditData.entries()))
        })
        .then(res => res.json())
        .then(data => {
            const record = document.querySelector(`[id="${data.updatedRecord.id}"]`);
            const elems = ['name', 'description'];
            elems.map(elem => {
                record.querySelector(`[data-category-${elem}]`).innerHTML = data.updatedRecord[elem];
            });
            setTotalSpent(data.total);
            bootstrap.Modal.getOrCreateInstance(modalEdit).hide();
        }).catch(err => console.error(err))
    });

    //Delete Category
    const deleteButtons = document.querySelectorAll('[data-delete-button]');

    Array.from(deleteButtons).map(button => {
        button.addEventListener('click', e => {
            e.preventDefault();
            const id = { id: button.dataset.deleteButton };
            fetch('/delete-category', {
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