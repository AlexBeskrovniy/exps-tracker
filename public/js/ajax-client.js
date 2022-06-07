"use strict"

import { record } from './modules/record.js';
import { getTotalSpentFromServer } from './modules/utils.js';

getTotalSpentFromServer();

if (record.recordForm) {
    record.create();
    if(record.tempWrapper) {
        record.update();
        record.delete();
    }
}