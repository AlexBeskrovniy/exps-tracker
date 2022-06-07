import { setFetchParams } from './modules/utils.js';

const categoryForm = document.querySelector('[data-category]');
const wrapper = document.querySelector('#category-wrapper');
const modalCreate = document.getElementById('modalFormNewCategory');
const categoryCard = document.getElementById('category-temp').content;
const slots = document.getElementById('category-slots').content;
const modalEdit = document.querySelector('#modalFormEditCategory');
const modal = new bootstrap.Modal(modalEdit);
const editForm = modalEdit.querySelector('[data-edit-category]');
const deleteBtn = modalEdit.querySelector('[data-delete-button]');

export const CategoryCard = class extends HTMLElement {
    constructor(id, name, description) {
        super();
        this.appendChild(slots.cloneNode(true));
        this._id = id || this.querySelector('[slot="id"]').textContent;
        this.name = name || this.querySelector('[slot="name"]').textContent;
        this.description = description || this.querySelector('[slot="description"]').textContent;
        this.setAttribute('data-id', this.id);
        this.setAttribute('class', 'col-sm-6 col-md-3 my-2 mx-0');
        this.setAttribute('style', 'width: 17rem"');
    }

    get id() {
        return this._id;
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(categoryCard.cloneNode(true));

        const editBtn = shadowRoot.querySelector('[data-edit-button]');

        editBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modalEdit.querySelector('[name="name"]').value = this.name;
            modalEdit.querySelector('[name="description"]').value = this.description;
            modalEdit.querySelector('[name="id"]').value = this.id;
            modal.show();
        });
    }
}

customElements.define('x-category-card', CategoryCard);

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

editForm.addEventListener('submit', e => {
    e.preventDefault();
    const formEditData = new FormData(editForm);
    fetch('/edit-category', setFetchParams(Object.fromEntries(formEditData.entries()), 'PUT'))
    .then(res => res.json())
    .then(data => {
        const card = document.querySelector(`[data-id="${data._id}"]`);
        card.querySelector('[slot="name"]').textContent = data.name;
        card.querySelector('[slot="description"]').textContent = data.description;
        modal.hide();
    }).catch(err => console.error(err));
});

deleteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const id = { id: modalEdit.querySelector('[name="id"]').value };

    fetch('/delete-category', setFetchParams(id, 'DELETE'))
    .then(res => res.json())
    .then(data => {
        const card = document.querySelector(`[data-id="${data.id}"]`);
        card.remove();
        modal.hide();
    }).catch(e => console.error(e));
})