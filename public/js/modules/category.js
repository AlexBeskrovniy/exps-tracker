"use strict"

import { setFetchParams } from './utils.js';
import { CategoryCard } from '../component-category.js';

const categoryForm = document.querySelector('[data-category]');
const wrapper = document.querySelector('#category-wrapper');
//Create Category
const createCategory = () => {
    const modalCreate = document.getElementById('modalFormNewCategory');

    categoryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const recordData = new FormData(categoryForm);

        fetch('/create-category', setFetchParams(Object.fromEntries(recordData.entries()), 'POST'))
        .then(res => res.json())
        .then(data => {
            const categoryCard = new CategoryCard(data._id, data.name, data.description);
            categoryCard.querySelector('[slot="name"]').textContent = categoryCard.name;
            categoryCard.querySelector('[slot="description"]').textContent = categoryCard.description;
            wrapper.prepend(categoryCard);
            bootstrap.Modal.getOrCreateInstance(modalCreate).hide();
        })
        .catch(e => console.error(e))
    });
}
//Update Category
const updateCategory = () => {
    const modalEdit = document.getElementById("modalFormEditCategory");
    const editForm = modalEdit.querySelector('[data-edit-category]');
    
    //Update the Unit   
    editForm.addEventListener('submit', e => {
        e.preventDefault();
        const formEditData = new FormData(editForm);
        fetch('/edit-category', setFetchParams(Object.fromEntries(formEditData.entries()), 'PUT'))
        .then(res => res.json())
        .then(data => {
            const card = document.querySelector(`[data-id="${data._id}"]`);
            card.querySelector('[slot="name"]').textContent = data.name;
            card.querySelector('[slot="description"]').textContent = data.description;
            bootstrap.Modal.getOrCreateInstance(modalEdit).hide();
        }).catch(err => console.error(err))
    });
}


//Delete Category
const deleteCategory = () => {
    const modalEdit = document.getElementById("modalFormEditCategory");
    const editForm = modalEdit.querySelector('[data-edit-category]');
    const deleteBtn = modalEdit.querySelector('[data-delete-button]');

    deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const id = { id: editForm.querySelector('[name="id"]').value };

        fetch('/delete-category', setFetchParams(id, 'DELETE'))
        .then(res => res.json())
        .then(data => {
            const card = document.querySelector(`[data-id="${data.id}"]`);
            card.remove();
        }).catch(e => console.error(e));
    });
}

// export const category = {
//     categoryForm: categoryForm,
//     categoryWrapper: wrapper,
//     create: createCategory,
//     update: updateCategory,
//     delete: deleteCategory
// };