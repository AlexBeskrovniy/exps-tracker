//Create Category
const recordForm = document.querySelector('[data-record]');
const modalCreate = document.getElementById('modalFormNewRecord');
const wrapper = document.querySelector('#record-wrapper');
const recordTemp = document.querySelector('#record-temp');

if (recordForm) {
    recordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const recordData = new FormData(recordForm);

        fetch('/create-record', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(recordData.entries()))
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const tempClone = recordTemp.content.firstElementChild.cloneNode(true);
            tempClone.dataset.recordDiv = data._id;
            tempClone.querySelector('[data-record-date]').textContent = new Date(data.createdAt).toDateString();
            tempClone.querySelector('[data-record-category]').textContent = data.category.name;
            tempClone.querySelector('[data-record-money]').textContent = data.money;
            tempClone.querySelector('[data-record-description]').textContent = data.description;
            let editBtn = tempClone.querySelector('[data-edit-button]');
            editBtn.dataset.editButton = data._id;
            editBtn.setAttribute('href', `form-edit-category/${data._id}`);
            let deleteBtn = tempClone.querySelector('[data-delete-button]');
            deleteBtn.dataset.deleteButton = data._id;
            //deleteBtn.setAttribute('href', `delete-category-no-js/${data._id}`);

            wrapper.prepend(tempClone);

            bootstrap.Modal.getOrCreateInstance(modalCreate).hide();
        })
        .catch(e => console.error(e))
    });
}

const modalEdit = document.getElementById("modalFormEditRecord");
const editForm = modalEdit.querySelector('[data-edit-record]');
const inputs = ['money', 'description', 'category', 'id'];
    
wrapper.addEventListener('click', e => {
    e.preventDefault();

    let eventTarget = e.target;
    if (eventTarget.closest('[data-edit-button]')) {
        const id = eventTarget.closest('[data-edit-button]').dataset.editButton;
        console.log(id);
        const target = document.querySelector(`[data-record-div="${id}"]`);
        console.log(target);
        inputs.map(input => {
            const inputEl = modalEdit.querySelector(`[name=${input}]`);
            const targetEl = target.querySelector(`[data-record-${input}]`);
            input === 'id' ?
            inputEl.value = id :
            inputEl.value = targetEl.textContent.trim();
        });
    }
});
//Update the Unit   
editForm.addEventListener('submit', e => {
    e.preventDefault();
    const formEditData = new FormData(editForm);
    fetch('/edit-record', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify(Object.fromEntries(formEditData.entries()))
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        const card = document.querySelector(`[data-record-div="${data._id}"]`);
        console.log(card);
        const elems = inputs.filter(input => input !== 'id');
        elems.map(elem => {
            card.querySelector('[data-record-category]') ?
            card.querySelector('[data-record-category]').innerHTML = data.category.name : 
            card.querySelector(`[data-record-${elem}]`).innerHTML = data[elem];
        });
        bootstrap.Modal.getOrCreateInstance(modalEdit).hide();
    }).catch(err => console.error(err))
});

//Delete Category

wrapper.addEventListener('click', (e) => {
    e.preventDefault();

    let eventTarget = e.target;
    if (eventTarget.closest('[data-delete-button]')) {
        const id = { id: eventTarget.closest('[data-delete-button]').dataset.deleteButton };

        fetch('/delete-record', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'DELETE',
            body: JSON.stringify(id)
        })
        .then(res => res.json())
        .then(data => {
            const deletedCard = document.querySelector(`[data-record-div="${data.id}"]`);
            deletedCard.remove();
        }).catch(e => console.error(e));
    }
});