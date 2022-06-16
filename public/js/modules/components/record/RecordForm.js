import { formRequestHandler } from '../../utils.js';
import { getTotalSpentFromServer } from '../../statistics.js';

getTotalSpentFromServer();

const SELECTORS = {
    recordWrapper: '#recordWrapper',
    deleteBtn: '[data-delete-button]'
}

const recordWrapper = document.querySelector(SELECTORS.recordWrapper);

customElements.define('x-record-form', class extends HTMLElement {
    connectedCallback() {
        this.form = this.querySelector('form');
        this.select = this.form.querySelector('select');
        this.form.addEventListener('submit', this.submitHandler.bind(this));
        this.modal = this.closest('.modal');
        if (this.getAttribute('type') === 'edit') {
            this.deleteBtn = this.querySelector(SELECTORS.deleteBtn);
            this.deleteBtn.addEventListener('click', this.deleteHandler.bind(this));
        }
        document.addEventListener('category:update', this.update.bind(this));
    }

    update() {
        fetch('/get-categories')
            .then(res => res.json())
            .then(data => {
                this.select.innerHTML = `${data.reduce((acc, cur) => {
                    return acc += `<option value="${cur._id}">${cur.name}</option>`
                }, '')}`
            })
            .catch(err => console.error(err));
    }

    submitHandler(e) {
        e.preventDefault();

        const props = this.getAttribute('type') === 'create'
            ? { 
                path: '/create-record',
                method: 'POST',
                msg: 'Record has successfully created!',
                form: this.form,
                callback: this.onCreate.bind(this)  
            }
            : { 
                path: '/edit-record',
                method: 'PUT',
                msg: 'Record has successfully updated!',
                form: this.form,
                callback: this.onUpdate.bind(this)  
            };
        
        formRequestHandler({ ...props });
        e.target.reset();
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
        this.closeModal();
        getTotalSpentFromServer();
    }

    onUpdate(data) {
        const card = document.querySelector(`[id="${data._id}"]`);
        card.querySelector('[data-record-date]').textContent = new Date(data.createdAt).toDateString();
        card.querySelector('[data-record-category]').textContent = data.category.name;
        card.querySelector('[data-record-money]').textContent = data.money;
        card.querySelector('[data-record-description]').textContent = data.description;
        this.closeModal();
        getTotalSpentFromServer();
    }

    deleteHandler(e) {
        e.preventDefault();

        const props = { 
            path: '/delete-record',
            method: 'DELETE',
            msg: 'Record has successfully deleted!',
            form: this.form,
            callback: this.onDelete.bind(this) 
        };

        formRequestHandler({ ...props });
    }

    onDelete(data) {
        const card = document.querySelector(`[id="${data.id}"]`);
        card.remove();
        this.closeModal();
        getTotalSpentFromServer();
    }
    
    closeModal() {
        bootstrap.Modal.getOrCreateInstance(this.modal).hide();
    }
});