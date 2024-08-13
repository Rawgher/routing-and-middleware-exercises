process.env.NODE_ENV = 'test'
const request = require('supertest');
const app = require('../app');
let items = require('../fakeDb')

let item = {name: 'lolipop', price: 2.25}

beforeEach(async () => {
    items.push(item);
});

afterEach(async () => {
    items = [];
});

describe("Get all /items", () => {
    test('Gets a list of all items', async () => {
        const res = await request(app).get('/items');
        const {items} = res.body;
        expect(res.statusCode).toBe(200);
        expect(items).toHaveLength(1);
    });
});

describe("Post to /items", () => {
    test('Adds a new item', async () => {
        const res = await request(app).post('/items')
        .send({name: 'ring pop', price: '3.00'});
        expect(res.statusCode).toBe(200);
        expect(res.body.item).toHaveProperty('name');
        expect(res.body.item).toHaveProperty('price');
        expect(res.body.item.name).toEqual('ring pop');
        expect(res.body.item.price).toEqual('3.00');
    });
});

describe('Get a specific item /items/:name', () => {
    test('Get the item', async () => {
        const res = await request(app).get(`/items/${item.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.item).toEqual(item);
    });

    test('404 response when cant find item', async () => {
        const res = await request(app).get(`/items/asdfasdf`);
        expect(res.statusCode).toBe(404);
    });
});

describe('Patch an item /items/:name', () => {
    test('Update an item', async () => {
        const res = await request(app).patch(`/items/${item.name}`)
        .send({
            name: "Candy Floss"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.item).toEqual({
            name: "Candy Floss"
        });
    });

    test('404 response when cant patch item', async () => {
        const res = await request(app).patch(`/items/asdfasdf`);
        expect(res.statusCode).toBe(404);
    });
});

describe('Delete /items/:name', () => {
    test('Deletes a specific item', async () => {
        const res = await request(app).delete(`/items/${item.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Item Removed" });
    });

    test('404 response when item missing', async () => {
        const res = await request(app).delete(`/items/asdfasdf`);
        expect(res.statusCode).toBe(404);
    });
});