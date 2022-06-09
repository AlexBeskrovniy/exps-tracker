import { getTotalSpentFromServer } from './modules/statistics.js';
import { setFetchParams } from './modules/utils.js';

const recordForm = document.querySelector('[data-record]');
const wrapper = document.querySelector('#record-wrapper');
const modalCreateRecord = document.getElementById('modalFormNewRecord');
const recordCard = document.getElementById('record-temp').content;
const slots = document.getElementById('record-slots').content;
const modalEditRecord = document.getElementById('modalFormEditRecord');
const modalRec = new bootstrap.Modal(modalEditRecord);
const editForm = modalEditRecord.querySelector('[data-edit-record]');
const deleteBtn = modalEditRecord.querySelector('[data-delete-button]');
const modalCloseBtn = modalEditRecord.querySelector('#modalClose');

export const RecordCard = class extends HTMLElement {
    constructor(id, date, spent, categoryId, categoryName, description) {
        super();
        this.appendChild(slots.cloneNode(true));
        this._id = id || this.querySelector('[slot="id"]').textContent;
        this.date = date || this.querySelector('[slot="date"]').textContent;
        this.spent = spent || this.querySelector('[slot="spent"]').textContent;
        this.categoryId = categoryId || this.querySelector('[slot="category-id"]').textContent;
        this.categoryName = categoryName || this.querySelector('[slot="category-name"]').textContent;
        this.description = description || this.querySelector('[slot="description"]').textContent;
        this.categoryInfo = document.createElement('option');
        this.categoryInfo.setAttribute('value', this.categoryId);
        this.categoryInfo.setAttribute('selected', 'true');
        this.categoryInfo.innerHTML = this.categoryName;
        this.setAttribute('data-id', this.id);
    }

    get id() {
        return this._id;
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(recordCard.cloneNode(true));
        
        const editBtn = shadowRoot.querySelector('[data-edit-button]');

        editBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modalEditRecord.querySelector('[name="money"]').value = this.spent;
            modalEditRecord.querySelector('[name="category"]').append(this.categoryInfo);
            modalEditRecord.querySelector('[name="description"]').value = this.description;
            modalEditRecord.querySelector('[name="id"]').value = this.id;
            modalRec.show();
        });
    }
}

customElements.define('x-record-card', RecordCard);

recordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const recordData = new FormData(recordForm);

    fetch('/create-record', setFetchParams(Object.fromEntries(recordData.entries()), 'POST'))
    .then(res => res.json())
    .then(data => {
        console.log(data);
        const recordCard = new RecordCard(data._id, data.createdAt, data.money, data.category._id, data.category.name, data.description);
        recordCard.querySelector('[slot="date"]').textContent = new Date(recordCard.date).toDateString();
        recordCard.querySelector('[slot="category-id"]').textContent = recordCard.categoryId;
        recordCard.querySelector('[slot="category-name"]').textContent = recordCard.categoryName;
        recordCard.querySelector('[slot="spent"]').textContent = recordCard.spent;
        recordCard.querySelector('[slot="description"]').textContent = recordCard.description;
        if (wrapper) {
            wrapper.prepend(recordCard);
        }
        bootstrap.Modal.getOrCreateInstance(modalCreateRecord).hide();
        getTotalSpentFromServer();
    })
    .catch(e => console.error(e))
});

editForm.addEventListener('submit', e => {
    e.preventDefault();
    const formEditData = new FormData(editForm);
    fetch('/edit-record', setFetchParams(Object.fromEntries(formEditData.entries()), 'PUT'))
    .then(res => res.json())
    .then(data => {
        const card = document.querySelector(`[data-id="${data._id}"]`);
        card.querySelector('[slot="category-id"]').textContent = data.category._id;
        card.querySelector('[slot="category-name"]').textContent = data.category.name;
        card.querySelector('[slot="spent"]').textContent = data.money;
        card.querySelector('[slot="description"]').textContent = data.description;
        modalRec.hide();
        getTotalSpentFromServer();
    }).catch(err => console.error(err));
});

deleteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const id = { id: modalEditRecord.querySelector('[name="id"]').value };

    fetch('/delete-record', setFetchParams(id, 'DELETE'))
    .then(res => res.json())
    .then(data => {
        const card = document.querySelector(`[data-id="${data.id}"]`);
        card.remove();
        modalRec.hide();
        getTotalSpentFromServer();
    }).catch(e => console.error(e));
});

getTotalSpentFromServer();