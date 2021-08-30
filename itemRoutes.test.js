process.env.NODE_ENV = 'test';
const request = require("supertest");

const app = require('./app');
let items = require('./fakeDb');

let item = { name: "test", price: .99};

beforeEach(()=> {
    items.push(item);
})

afterEach(()=> {
    items.length = 0; 
})


describe("GET /items", ()=>{
    test("Get all items", async ()=>{
        const res = await request(app).get("/items");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(items)
    })
});

describe("GET /items/:name", ()=>{
    test("Get item by name", async ()=>{
        const res = await request(app).get(`/items/${item.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(item)
    });

    test("Responds with 404 with invalid item name", async ()=>{
        const res = await request(app).get(`/items/test1`);
        expect(res.statusCode).toBe(404);
    })
})

describe("POST /items", ()=> {
    test("Creating an item", async ()=> {
        const item2 = {name: "test2", price: .99}
        const res = await request(app).post("/items").send(item2)
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({added: item2});

    });

    test("Responds with 400 if name and price is missing", async ()=> {
        const res = await request(app).post("/items").send({})
        expect(res.statusCode).toBe(400);
  
    });

    test("Responds with 400 if name is missing", async ()=> {
        const res = await request(app).post("/items").send({price: .99})
        expect(res.statusCode).toBe(400);
  
    });

    test("Responds with 400 if name is missing", async ()=> {
        const res = await request(app).post("/items").send({name: "test2"})
        expect(res.statusCode).toBe(400);
  
    });
})

describe("/PATCH /items/:name", () => {
    test("Updating a item's name", async()=> {
        const res = await request(app).patch(`/items/${item.name}`).send({name: "test2"})
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({updated: {name: "test2", price: .99}})
    });

    test("Updating a item's price", async()=> {
        const res = await request(app).patch(`/items/${item.name}`).send({price: 1.99})
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({updated: {name: item.name, price: 1.99}})
    });

    test("Responds with 404 for invalid name", async ()=> {
        const res = await request(app).patch('/items/test4').send({name: "test3"});
        expect(res.statusCode).toBe(404);
    })
});

describe("DELETE /items/:name", ()=> {
    test("Deleting an item", async()=>{
        const res = await request(app).delete(`/items/${item.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({message: 'Deleted'})
    });
    test("Responds with 404 for deleting invalid item", async()=>{
        const res = await request(app).delete(`/items/test9999`);
        expect(res.statusCode).toBe(404);
    })
})