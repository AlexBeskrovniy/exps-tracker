import { doFetch } from '../../utils.js';

const SELECTORS = {
    categoryWrapper: '#categoryWrapper',
    alertWrapper: '#alertWrapper',
    deleteBtn: '[data-delete-button]',
    modalCreate: '#modalFormNewCategory',
    modalEdit: '#modalFormEditCategory'
}

const alertWrapper = document.querySelector(SELECTORS.alertWrapper);
const categoryWrapper = document.querySelector(SELECTORS.categoryWrapper);
const modalCreate = document.querySelector(SELECTORS.modalCreate);
const modalEdit = document.querySelector(SELECTORS.modalEdit);

customElements.define('x-category-form', class extends HTMLElement {
    connectedCallback() {
        this.form = this.querySelector('form');
        this.form.addEventListener('submit', this.submitHandler.bind(this));
        if (this.getAttribute('type') === 'edit') {
            this.deleteBtn = this.querySelector(SELECTORS.deleteBtn);
            this.deleteBtn.addEventListener('click', this.deleteHandler.bind(this));
        }
    }
    submitHandler(e) {
        e.preventDefault();
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries())

        const props = this.getAttribute('type') === 'create'
            ? { 
                path: '/create-category',
                method: 'POST',
                msg: 'Category has successfully created!',
                callback: this.onCreate  
            }
            : { 
                path: '/edit-category',
                method: 'PUT',
                msg: 'Category has successfully updated!',
                callback: this.onUpdate  
            };
        
        doFetch(data, props, alertWrapper);
    }

    onCreate(data) {
        const card = document.createElement('x-category-card');
        card.setAttribute('id', data._id); 
        card.setAttribute('name', data.name);
        card.setAttribute('description', data.description);
        bootstrap.Modal.getOrCreateInstance(modalCreate).hide();
        categoryWrapper.prepend(card);
    }

    onUpdate(data) {
        const card = document.querySelector(`[id="${data._id}"]`);
        card.querySelector('[data-category-name]').textContent = data.name;
        card.querySelector('[data-category-description]').textContent = data.description;
        bootstrap.Modal.getOrCreateInstance(modalEdit).hide();
    }

    deleteHandler(e) {
        e.preventDefault();

        const id = this.querySelector('[name="id"]').value;
        const props = { 
            path: '/delete-category',
            method: 'DELETE',
            msg: 'Category has successfully deleted!',
            callback: this.onDelete  
        };

        doFetch({ id: id }, props, alertWrapper);
    }

    onDelete(data) {
        const card = document.querySelector(`[id="${data.id}"]`);
        card.remove();
        bootstrap.Modal.getOrCreateInstance(modalEdit).hide();
    }        
});