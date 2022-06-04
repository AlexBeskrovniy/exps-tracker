"use strict"

import { record } from './modules/record.js';
import { category } from './modules/category.js';
import { getTotalSpentFromServer } from './modules/utils.js';

window.addEventListener('load', async (e) => {
    e.preventDefault;
    try {
        await getTotalSpentFromServer();
    } catch (err) {
        console.error(err);
    }
})

if (record.recordForm) {
    record.create();
    if(record.tempWrapper) {
        record.update();
        record.delete();
    }
}

if (category.categoryForm) {
    category.create();
    if (category.categoryWrapper) {
        category.update();
        category.delete();
    }
}