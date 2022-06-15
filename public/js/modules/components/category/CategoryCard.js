import { setDataToCard, setValuesToForm } from '../../utils.js';

const categoryTemplate = document.querySelector('#categoryTemp');

customElements.define('x-category-card', class extends HTMLElement {
    connectedCallback() {
        this.attrs = ['name', 'description'];
        this.replaceChildren(...categoryTemplate.content.cloneNode(true).childNodes);
        this.classList.add('col-sm-6', 'col-lg-3', 'my-2', 'mx-0');
        setDataToCard(this, 'category', this.attrs);
        this.editBtn = this.querySelector('[data-edit-button]');
        this.editBtn.addEventListener('click', this.showEditForm.bind(this));
    }
    showEditForm(e) {
        const editForm = document.querySelector('[data-category-edit]');
        setValuesToForm(editForm,
            {
                id: this.getAttribute('id' ),
                name: this.getAttribute('name'),
                description: this.getAttribute('description')
            }
        );
    }
});