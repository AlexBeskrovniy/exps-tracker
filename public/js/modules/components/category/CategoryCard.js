import { setDataToCard, setValuesToForm } from '../../utils.js';

const categoryTemp = document.querySelector('#categoryTemp');

customElements.define('x-category-card', class extends HTMLElement {
    connectedCallback() {
        this.attrs = ['name', 'description'];
        this.replaceChildren(...categoryTemp.content.cloneNode(true).childNodes);
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

// categoryForm.addEventListener('submit', function(e) {
//     e.preventDefault();
//     const recordData = new FormData(categoryForm);

//     fetch('/create-category', setFetchParams(Object.fromEntries(recordData.entries()), 'POST'))
//     .then(res => {
//             const alert = getAlert(res.ok, 'Category', 'created');
//             alertWrapper.append(alert);
//         res.json().then(data => {
//             const categoryCard = new CategoryCard(data._id, data.name, data.description);
            
//             categoryCard.querySelector('[slot="name"]').textContent = categoryCard.name;
//             categoryCard.querySelector('[slot="description"]').textContent = categoryCard.description;
//             wrapper.prepend(categoryCard);
//             bootstrap.Modal.getOrCreateInstance(modalCreate).hide();
//         })
//     })
//     .catch(e => console.error(e))
// });

// editForm.addEventListener('submit', e => {
//     e.preventDefault();
//     const formEditData = new FormData(editForm);
//     fetch('/edit-category', setFetchParams(Object.fromEntries(formEditData.entries()), 'PUT'))
//     .then(res => {
//         const alert = getAlert(res.ok, 'Category', 'updated');
//         alertWrapper.append(alert);
//     res.json().then(data => {
//             const card = document.querySelector(`[data-id="${data._id}"]`);
//             card.querySelector('[slot="name"]').textContent = data.name;
//             card.querySelector('[slot="description"]').textContent = data.description;
//             modal.hide();
//         }).catch(err => console.error(err));
//     });
// });

// deleteBtn.addEventListener('click', (e) => {
//     e.preventDefault();
//     if (confirm("This action will remove this category. Continue?")) {
//         const id = { id: modalEdit.querySelector('[name="id"]').value };

//         fetch('/delete-category', setFetchParams(id, 'DELETE'))
//         .then(res => {
//             const alert = getAlert(res.ok, 'Category', 'deleted');
//             alertWrapper.append(alert);    
//         res.json().then(data => {
//                 const card = document.querySelector(`[data-id="${data.id}"]`);
//                 card.remove();
//                 modal.hide();
//             }).catch(e => console.error(e));
//         });
//     }
// });