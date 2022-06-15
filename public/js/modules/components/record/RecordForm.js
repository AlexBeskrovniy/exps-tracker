import { formRequestHandler } from '../../utils.js';
import { getTotalSpentFromServer } from '../../statistics.js';

const SELECTORS = {
    recordWrapper: '#recordWrapper',
    deleteBtn: '[data-delete-button]',
    modalCreate: '#modalFormNewRecord',
    modalEdit: '#modalFormEditRecord'
}

const recordWrapper = document.querySelector(SELECTORS.recordWrapper);
const modalCreate = document.querySelector(SELECTORS.modalCreate);
const modalEdit = document.querySelector(SELECTORS.modalEdit);

customElements.define('x-record-form', class extends HTMLElement {
    connectedCallback() {
        this.form = this.querySelector('form');
        this.form.addEventListener('submit', this.submitHandler.bind(this));
        if (this.getAttribute('type') === 'edit') {
            this.deleteBtn = this.querySelector(SELECTORS.deleteBtn);
            this.deleteBtn.addEventListener('click', this.deleteHandler.bind(this));
        }
        getTotalSpentFromServer();
    }
    submitHandler(e) {
        e.preventDefault();

        const props = this.getAttribute('type') === 'create'
            ? { 
                path: '/create-record',
                method: 'POST',
                msg: 'Record has successfully created!',
                form: this.form,
                callback: this.onCreate  
            }
            : { 
                path: '/edit-record',
                method: 'PUT',
                msg: 'Record has successfully updated!',
                form: this.form,
                callback: this.onUpdate  
            };
        
        formRequestHandler({ ...props });
    }

    onCreate(data) {
        if (recordWrapper) {
            const card = document.createElement('x-record-card');
            card.setAttribute('id', data._id);
            card.setAttribute('date', new Date(data.createdAt).toDateString()); 
            card.setAttribute('category-id', data.category._id);
            card.setAttribute('category', data.category.name);
            card.setAttribute('money', data.money);
            card.setAttribute('description', data.description);
            recordWrapper.prepend(card);
        }
        bootstrap.Modal.getOrCreateInstance(modalCreate).hide();
        getTotalSpentFromServer();
    }

    onUpdate(data) {
        const card = document.querySelector(`[id="${data._id}"]`);
        card.querySelector('[data-record-date]').textContent = new Date(data.createdAt).toDateString();
        card.querySelector('[data-record-category]').textContent = data.category.name;
        card.querySelector('[data-record-money]').textContent = data.money;
        card.querySelector('[data-record-description]').textContent = data.description;
        bootstrap.Modal.getOrCreateInstance(modalEdit).hide();
        getTotalSpentFromServer();
    }

    deleteHandler(e) {
        e.preventDefault();

        const props = { 
            path: '/delete-record',
            method: 'DELETE',
            msg: 'Record has successfully deleted!',
            form: this.form,
            callback: this.onDelete  
        };

        formRequestHandler({ ...props });
    }

    onDelete(data) {
        const card = document.querySelector(`[id="${data.id}"]`);
        card.remove();
        bootstrap.Modal.getOrCreateInstance(modalEdit).hide();
        getTotalSpentFromServer();
    }        
});