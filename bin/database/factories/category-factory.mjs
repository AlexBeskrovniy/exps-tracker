import { faker } from '@faker-js/faker';

export const fakeCategories = (x) => {
    let fakeCats = [];
    for (let i = 0; i < x; i++) {
        let fakeCat = {
            name: faker.random.word(),
            description: faker.lorem.sentences(2)
        }
    fakeCats.push(fakeCat);
    }
    return fakeCats;
}