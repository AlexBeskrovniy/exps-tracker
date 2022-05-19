"use strict"
//For Create
const recordForm = document.querySelector('[data-record]');
const submitButton = document.getElementById('submit');
//For Change
const wrap = document.getElementById('record-wrap');
const deleteForms = document.querySelectorAll('[data-delete]');
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
                            keys.push(existsRecords[i].date);
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
    }
}