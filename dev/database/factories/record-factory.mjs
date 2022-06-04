import { faker } from '@faker-js/faker';

export const fakeRecords = (x, array) => {
    let fakeRecs = [];
    for (let i = 0; i < x; i++) {
        let fakeRec = {
            money: faker.random.numeric(5),
            category: faker.helpers.arrayElement(array),
            description: faker.lorem.sentences(2)
        }
    fakeRecs.push(fakeRec);
    }
    return fakeRecs;
}