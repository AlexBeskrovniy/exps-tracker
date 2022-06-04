"use strict"

import { setFetchParams } from "./utils.js";

export const categoryForm = document.querySelector('[data-category]');
export const wrapper = document.querySelector('#category-wrapper');
//Create Category
export const createCategory = () => {
    const modalCreate = document.getElementById('modalFormNewCategory');
    const categoryTemp = document.querySelector('#category-temp');

    categoryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const recordData = new FormData(categoryForm);

        fetch('/create-category', setFetchParams(Object.fromEntries(recordData.entries()), 'POST'))
        .then(res => res.json())
        .then(data => {
            const tempClone = categoryTemp.content.firstElementChild.cloneNode(true);
            tempClone.dataset.categoryDiv = data._id;
            tempClone.querySelector('[data-category-name]').textContent = data.name;
            tempClone.querySelector('[data-category-description]').textContent = data.description;
            let editBtn = tempClone.querySelector('[data-edit-button]');
            editBtn.dataset.editButton = data._id;
            editBtn.setAttribute('href', `form-edit-category/${data._id}`);
            let deleteBtn = tempClone.querySelector('[data-delete-button]');
            deleteBtn.dataset.deleteButton = data._id;
            deleteBtn.setAttribute('href', `delete-category-no-js/${data._id}`);

            wrapper.prepend(tempClone);

            bootstrap.Modal.getOrCreateInstance(modalCreate).hide();
        })
        .catch(e => console.error(e))
    });
}

//Show Edit Form and Update Category
export const updateCategory = () => {
    const modalEdit = document.getElementById("modalFormEditCategory");
    const editForm = modalEdit.querySelector('[data-edit-category]');
    const inputs = ['name', 'description', 'id'];
        
    wrapper.addEventListener('click', e => {
        e.preventDefault();

        let eventTarget = e.target;
        if (eventTarget.closest('[data-edit-button]')) {
            const id = eventTarget.closest('[data-edit-button]').dataset.editButton;
            const target = document.querySelector(`[data-category-div="${id}"]`);
            inputs.map(input => {
                const inputEl = modalEdit.querySelector(`[name=${input}]`);
                const targetEl = target.querySelector(`[data-category-${input}]`);
                input === 'id' ?
                inputEl.value = id :
                inputEl.value = targetEl.textContent.trim();
            });
        }
    });
    //Update the Unit   
    editForm.addEventListener('submit', e => {
        e.preventDefault();
        const formEditData = new FormData(editForm);
        fetch('/edit-category', setFetchParams(Object.fromEntries(formEditData.entries()), 'PUT'))
        .then(res => res.json())
        .then(data => {
            const card = document.querySelector(`[data-category-div="${data._id}"]`);
            const elems = inputs.filter(input => input !== 'id');
            elems.map(elem => {
                card.querySelector(`[data-category-${elem}]`).innerHTML = data[elem];
            });
            bootstrap.Modal.getOrCreateInstance(modalEdit).hide();
        }).catch(err => console.error(err))
    });
}


//Delete Category
export const deleteCategory = () => {
    wrapper.addEventListener('click', (e) => {
        e.preventDefault();

        let eventTarget = e.target;
        if (eventTarget.closest('[data-delete-button]')) {
            const id = { id: eventTarget.closest('[data-delete-button]').dataset.deleteButton };

            fetch('/delete-category', setFetchParams(id, 'DELETE'))
            .then(res => res.json())
            .then(data => {
                const deletedCard = document.querySelector(`[data-category-div="${data.id}"]`);
                deletedCard.remove();
            }).catch(e => console.error(e));
        }
    });
}

export const category = {
    categoryForm: categoryForm,
    categoryWrapper: wrapper,
    create: createCategory,
    update: updateCategory,
    delete: deleteCategory
};