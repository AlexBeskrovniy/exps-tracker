"use strict"
const recordForm = document.querySelector('[data-record]');
const submitButton = document.getElementById('submit');

if (recordForm) {
    recordForm.addEventListener('submit', function(e) {
        e.preventDefault();

        setTimeout(function() {submitButton.setAttribute('disabled', 'true')}, 100);

        const formData = new FormData(recordForm);

        const record = JSON.stringify({
            money: formData.get('money'),
            category: formData.get('category'),
            description: formData.get('description')
        });

        const newRecord = new XMLHttpRequest();
            newRecord.open('POST', '/', true);
            newRecord.setRequestHeader('Content-Type', 'application/json');
            newRecord.send(record);
            newRecord.addEventListener('load', function () {
            if(newRecord.status === 201) {
                setTimeout(function() {
                    recordForm.elements['money'].value = '';
                    recordForm.elements['category'].value = '';
                    recordForm.elements['description'].value = '';
                    submitButton.removeAttribute('disabled');
                }, 2000);
            }
            console.log(newRecord.status);
            console.log(newRecord.response);
        });
    });
}