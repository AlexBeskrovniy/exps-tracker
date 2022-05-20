"use strict"
//For Create
const recordForm = document.querySelector('[data-record]');
const submitButton = document.getElementById('submit');
//For Change
const wrap = document.getElementById('record-wrap');
const deleteForms = document.querySelectorAll('[data-delete]');
const editFormButtons = document.querySelectorAll('[data-edit-button]');
const editForm = document.querySelector('[data-edit]');
const updateButton = document.getElementById('update');
const temp = document.getElementById('edit-feedback');
//Create
if (recordForm) {
    recordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        setTimeout(function() {submitButton.setAttribute('disabled', 'true')}, 100);

    let money = recordForm.elements['money'].value;
    let category = recordForm.elements['category'].value;
    let description = recordForm.elements['description'].value;
    let date = Date.now();

    const record = JSON.stringify({
        money: money,
        category: category,
        description: description,
        date: date
    });

    const newRequest = new XMLHttpRequest();
        newRequest.open('POST', '/', true);
        newRequest.setRequestHeader('Content-Type', 'application/json');
        newRequest.send(record);
        newRequest.addEventListener('load', function () {
            if (newRequest.status === 201) {
                setTimeout(function() {
                    recordForm.elements['money'].value = '';
                    recordForm.elements['category'].value = '';
                    recordForm.elements['description'].value = '';
                }, 2000);
                setTimeout(function() {submitButton.removeAttribute('disabled');
                }, 2000);
            }
            console.log(newRequest.status);
            console.log(newRequest.response);
        });
    });
}
//Delete
if (wrap) {
    if (deleteForms) {
        for (let i = 0; i < deleteForms.length; i+=1) {
            deleteForms[i].addEventListener('submit', function(e) {
                e.preventDefault();

                let data = deleteForms[i].elements['id'].value;

                const id = JSON.stringify({
                    id: data
                });

                const delRequest = new XMLHttpRequest();
                delRequest.open('POST', '/all-records', true);
                delRequest.setRequestHeader('Content-Type', 'application/json');
                delRequest.send(id);
                delRequest.addEventListener('load', function () {
                    if (delRequest.status === 201) {
                        console.log(delRequest.status);
                        const existsRecords = JSON.parse(delRequest.response);
                        const recordCards = document.getElementsByClassName('record-card');
                        const cards = Array.from(recordCards);
    
                        const keys = [];
                        for (let i = 0; i < existsRecords.length; i+=1) {
                            keys.push(Number(existsRecords[i].date));
                        }
                        console.log(keys);
                        console.log(cards);
    
                        cards.forEach(function(card) {
                            let cardId = card.getAttribute("id");
                            if (!keys.includes(Number(cardId))) {
                                card.setAttribute("style", "display: none;");
                            }
                        });
                    }
                });
            });
        }
//Update
        for (let i = 0; i < editFormButtons.length; i+=1) {
            editFormButtons[i].addEventListener('click', function(e) {
                e.preventDefault();
                const buttonId = editFormButtons[i].getAttribute('id');
                const recordCard = document.getElementById(buttonId);

                const money = recordCard.firstChild.nextSibling.firstChild.nextSibling.firstChild.
                                nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.firstChild.
                                nextSibling.nextSibling.nextSibling;
                const category = recordCard.firstChild.nextSibling.firstChild.nextSibling.firstChild.
                                    nextSibling.nextSibling.nextSibling.firstChild.
                                    nextSibling.nextSibling.nextSibling;
                const description = recordCard.firstChild.nextSibling.firstChild.nextSibling.firstChild.
                                    nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.
                                    firstChild.nextSibling.nextSibling.nextSibling;

                const moneyInput = document.getElementById('floatingInputNumEdit');
                const categoryInput = document.getElementById('floatingSelectEdit');
                const descriptionInput = document.getElementById('floatingTextareaEdit');

                moneyInput.setAttribute('value', `${money.textContent}`);
                categoryInput.insertAdjacentHTML('afterbegin',
                                        `<option value="${category.textContent}" selected>${category.textContent}</option>`);
                descriptionInput.textContent = description.textContent.trim();

                editForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    setTimeout(function() {updateButton.setAttribute('disabled', 'true')}, 100);

                    let editedMoney = editForm.elements['money'].value;
                    let editedCategory = editForm.elements['category'].value;
                    let editedDescription = editForm.elements['description'].value;

                    const editedRecord = JSON.stringify({
                        money: editedMoney,
                        category: editedCategory,
                        description: editedDescription,
                        date: buttonId
                    });

                    console.log(editedRecord);
    
                    let editRequest = new XMLHttpRequest();
                    editRequest.open('POST', '/edit-record', true);
                    editRequest.setRequestHeader('Content-Type', 'application/json');
                    editRequest.send(editedRecord);
                    editRequest.addEventListener('load', function () {
                        if (editRequest.status === 201) {
                            console.log(editRequest.status);
                            setTimeout(function() {
                                editForm.elements['money'].value = '';
                                editForm.elements['category'].value = '';
                                editForm.elements['description'].value = '';
                            }, 2000);
                            setTimeout(function() {updateButton.removeAttribute('disabled');
                            }, 2000);
                            const updatedRecord = JSON.parse(editRequest.response);

                            //Set updated values to the record card. 
                            money.textContent = updatedRecord.money;
                            category.textContent = updatedRecord.category;
                            description.textContent = updatedRecord.description;

                            //Feedback
                            let clone = temp.content.cloneNode(true);
                            let message = clone.getElementById('message');
                            let tempDiv = clone.getElementById('temp-div');
                            tempDiv.classList.add('bg-success')
                            message.textContent = "Success!";
                            editForm.appendChild(clone);
                            setTimeout(function() {
                                editForm.lastChild.previousSibling.remove();
                            }, 3000);
                        } else {
                            //Feedback
                            let clone = temp.content.cloneNode(true);
                            let message = clone.getElementById('message');
                            let tempDiv = clone.getElementById('temp-div');
                            tempDiv.classList.add('bg-danger')
                            message.textContent = "Error!";
                            editForm.appendChild(clone);
                            setTimeout(function() {
                                editForm.lastChild.previousSibling.remove();
                            }, 3000);
                        }
                    });
                });
            });
        }
    }
}
//Total spent
const totalOutput = document.getElementById('totalOutput');
const requestTotal = JSON.stringify({
                            total: ''
                        });

window.addEventListener('load', function(e) {
    e.preventDefault();

    let spentRequest = new XMLHttpRequest();
    spentRequest.open('POST', '/total', true);
    spentRequest.setRequestHeader('Content-Type', 'application/json');
    spentRequest.send(requestTotal);
    spentRequest.addEventListener('load', function() {
        if (spentRequest.status === 200) {
            const total = JSON.parse(spentRequest.response);
            totalOutput.setAttribute('value', `${total.result}`);
            console.log(total);
        }
    });     
})