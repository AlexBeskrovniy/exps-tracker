const LS_RECORDS_KEY = 'ls-records';
const LS_CATEGORIES_KEY = 'ls-categories';
const LS_TOTAL_SPENT_KEY = 'ls-total';

// HELPERS
function getTotalSpent(){
    return localStorage[LS_TOTAL_SPENT_KEY]
            ? localStorage[LS_TOTAL_SPENT_KEY]
            : 0;
}

function getAllRecords() {
    return JSON.parse(localStorage[LS_RECORDS_KEY]);
}
//HELPERS


//Create new Record and update total spent value
function createRecord() {
    const recordForm = document.querySelector('[data-record]');
    if (recordForm) {
        const formData = new FormData(recordForm);

        const record = {
            money: formData.get('money'),
            category: formData.get('category'),
            description: formData.get('description'),
            date: Date.now()
        };

        const records = 
            localStorage[LS_RECORDS_KEY] 
                ? JSON.parse(localStorage[LS_RECORDS_KEY]) 
                : [];
                
        localStorage[LS_RECORDS_KEY] = JSON.stringify([record, ...records]); 

        //Save updated total spent value
        const oldTotal = getTotalSpent();

        localStorage[LS_TOTAL_SPENT_KEY] = Number(oldTotal) + Number(record.money);
    }
}

function showTotalSpent(){
    let output = document.getElementById('totalOutput');
    return output.value = getTotalSpent();
}

//Show all records
function showAllRecords() {
    const allRecords = getAllRecords();
    const wrap = document.getElementById('record-wrap');
    const temp = document.getElementById('record-card');

    allRecords.forEach(function(record) {
        //console.log(record);
        let clone = temp.content.cloneNode(true);

        let date = clone.getElementById('record-date');
        let category = clone.getElementById('record-category');
        let money = clone.getElementById('record-spent');
        let description = clone.getElementById('record-description');
        let editLink = clone.getElementById('edit-link');
        let deleteForm = clone.querySelector('[data-delete]');

        date.textContent = new Date(record.date).toDateString();
        category.textContent = record.category;
        money.textContent = record.money;
        description.textContent = record.description;
        editLink.setAttribute("onclick", `showEditForm(${record.date});`);
        deleteForm.setAttribute("onsubmit", `deleteRecord(${record.date});`);
        wrap.appendChild(clone);
    });

    return wrap;
}

//Delete record and update total spent value
function deleteRecord(timestamp) {
    const allRecords = getAllRecords();
    const oldTotal = getTotalSpent();
    for (let i = 0; i < allRecords.length; i+=1) {
        if (allRecords[i].date === timestamp) {
            localStorage[LS_TOTAL_SPENT_KEY] = Number(oldTotal) - Number(allRecords[i].money);
            allRecords.splice(i, 1);
        }
    }
    localStorage[LS_RECORDS_KEY] = JSON.stringify([...allRecords]);
}

function showEditForm(timestamp){
    const allRecords = getAllRecords();
    const money = document.getElementById('floatingInputNumEdit');
    const category = document.getElementById('floatingSelectEdit');
    const description = document.getElementById('floatingTextareaEdit');
    const editForm = document.querySelector('[data-edit]');

    for (let i = 0; i < allRecords.length; i+=1) {
        if (allRecords[i].date === timestamp) {
            money.setAttribute("value", `${allRecords[i].money}`);
            category.insertAdjacentHTML('afterbegin',
                        `<option value="${allRecords[i].category}" selected>${allRecords[i].category}</option>`);
            description.textContent = allRecords[i].description;
            editForm.setAttribute("onsubmit", `updateRecord(${allRecords[i].date}); updateTotalSpent();`);
        }
    }
}

function updateRecord(timestamp) {
    const allRecords = getAllRecords();
    const updateForm = document.querySelector('[data-edit]');
    if (updateForm) {
        const formNewData = new FormData(updateForm);

        const newRecord = {
            money: formNewData.get('money'),
            category: formNewData.get('category'),
            description: formNewData.get('description'),
            date: timestamp
        };
    
        for (let i = 0; i < allRecords.length; i+=1) {
            if (allRecords[i].date === timestamp) {
                allRecords.splice(i, 1, newRecord);
            }
        }
        localStorage[LS_RECORDS_KEY] = JSON.stringify([...allRecords]);
    }
}

//Updating total spent before record updating
function updateTotalSpent() {
    const allRecords = getAllRecords();
    let totalSpent = 0;
    allRecords.forEach(function(record) {
        totalSpent += Number(record.money);
    });

    localStorage[LS_TOTAL_SPENT_KEY] = totalSpent;
}

console.log(localStorage[LS_TOTAL_SPENT_KEY]);