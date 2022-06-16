import { formRequestHandler } from '../../utils.js';

const SELECTORS = {
    categoryWrapper: '#categoryWrapper',
    deleteBtn: '[data-delete-button]',
}

const categoryWrapper = document.querySelector(SELECTORS.categoryWrapper);

customElements.define('x-category-form', class extends HTMLElement {
    connectedCallback() {
        this.form = this.querySelector('form');
        this.modal = this.closest('.modal');
        this.form.addEventListener('submit', this.submitHandler.bind(this));
        if (this.getAttribute('type') === 'edit') {
            this.deleteBtn = this.querySelector(SELECTORS.deleteBtn);
            this.deleteBtn.addEventListener('click', this.deleteHandler.bind(this));
        }
    }
    submitHandler(e) {
        e.preventDefault();

        const props = this.getAttribute('type') === 'create'
            ? { 
                path: '/create-category',
                method: 'POST',
                msg: 'Category has successfully created!',
                form: this.form,
                callback: this.onCreate.bind(this)  
            }
            : { 
                path: '/edit-category',
                method: 'PUT',
                msg: 'Category has successfully updated!',
                form: this.form,
                callback: this.onUpdate.bind(this) 
            };
        
        formRequestHandler({ ...props });
        e.target.reset();
    }

    onCreate(data) {
        const card = document.createElement('x-category-card');
        card.setAttribute('id', data._id); 
        card.setAttribute('name', data.name);
        card.setAttribute('description', data.description);
        categoryWrapper.prepend(card);
        this.closeModal();
        this.updateRecordForm();
    }

    onUpdate(data) {
        const card = document.querySelector(`[id="${data._id}"]`);
        card.querySelector('[data-category-name]').textContent = data.name;
        card.querySelector('[data-category-description]').textContent = data.description;
        this.closeModal();
        this.updateRecordForm();
    }

    deleteHandler(e) {
        e.preventDefault();

        const props = { 
            path: '/delete-category',
            method: 'DELETE',
            msg: 'Category has successfully deleted!',
            form: this.form,
            callback: this.onDelete.bind(this) 
        };

        formRequestHandler({ ...props });
    }

    onDelete(data) {
        const card = document.querySelector(`[id="${data.id}"]`);
        card.remove();
        this.closeModal();
        this.updateRecordForm();
       
    }

    closeModal() {
        bootstrap.Modal.getOrCreateInstance(this.modal).hide();
    }
    
    updateRecordForm() {
        document.dispatchEvent(new CustomEvent('category:update'));
    }
});