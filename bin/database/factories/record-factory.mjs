import { faker } from '@faker-js/faker';
import moment from 'moment';

let now = Date.now();

export const fakeRecords = (x, array) => {
    let fakeRecs = [];
    for (let i = 0; i < x; i++) {
        let fakeRec = {
            money: faker.random.numeric(5),
            category: faker.helpers.arrayElement(array),
            description: faker.lorem.sentences(2),
            createdAt: faker.date.between(
                moment().startOf('month').subtract(1, 'month').toISOString(),
                moment().endOf('month').toISOString()
            )
        }
    fakeRecs.push(fakeRec);
    }
    return fakeRecs;
}