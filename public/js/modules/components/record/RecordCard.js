import { setDataToCard, setValuesToForm } from '../../utils.js';

const recordTemplate = document.querySelector('#recordTemp');

customElements.define('x-record-card', class extends HTMLElement {
    connectedCallback() {
        this.attrs = ['date', 'category', 'money', 'description'];
        this.replaceChildren(...recordTemplate.content.cloneNode(true).childNodes);
        setDataToCard(this, 'record', this.attrs);
        this.editBtn = this.querySelector('[data-edit-button]');
        this.editBtn.addEventListener('click', this.showEditForm.bind(this));
    }
    
    showEditForm(e) {
        const editForm = document.querySelector('[data-record-edit]');
        setValuesToForm(editForm,
            {
                id: this.getAttribute('id' ),
                money: this.getAttribute('money'),
                description: this.getAttribute('description')
            }
        );
        
        const categoryId = this.getAttribute('category-id');
        editForm.querySelector(`[value="${categoryId}"]`).selected = true;
    }
});