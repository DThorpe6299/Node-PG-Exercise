process.env.NODE_ENV="test";
const request = require("supertest");

const app =require("../../app");
let db= require('../../db');

let testCompany;
beforeEach(() => {
    return new Promise((resolve, reject) => {
        // Insert a test company into the database before each test
        db.query(`INSERT INTO companies (code, name, description) VALUES ('verizon', 'Verizon', 'A phone company') RETURNING code, name, description`)
            .then(result => {
                testCompany = result.rows[0];
                console.log({ testCompany });
                resolve(); // Resolve the promise to signal completion
            })
            .catch(error => {
                reject(error); // Reject the promise if there's an error
            });
    });
},10000);

describe("Gets a list of 1 company", ()=>{
    test("Gets all companies", async()=>{
        const res = await request(app).get('/companies')
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({companies:[testCompany]})
    })
    test("Gets a single company", async()=>{
        const res = await request(app).get(`/companies/${testCompany.code}`)
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({companies:[testCompany]})
    })
})

describe("POST /companies", ()=>{
    test("Creates a single company", async()=>{
        const res = await request(app).post('/companies').send({code:'capitalOne', name:'Capital One', description:'A bank'});
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({code:'capitalOne', name:'Capital One', description:'A bank'})
    })
})

describe("PATCH /companies/:code", ()=>{
    test("Updates a single company", async()=>{
        const res = await request(app).patch(`/companies/${testCompany.code}`).send({code:'mcdonalds', name:'McDonalds', description:'Fast Food'})
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({code:'mcdonalds', name:'McDonalds', description:'Fast Food'})
    })
})

describe("Delete /companies/:code", ()=>{
    test("Deletes a single user", async()=>{
        const res = await request(app).delete(`/companies/${testCompany.code}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({status: "Deleted"})
    })
})

afterEach(() => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM companies`)
            .then(() => {
                resolve();
            })
            .catch(error => {
                reject(error);
            });
    });
},10000);

afterAll(() => {
    return new Promise((resolve, reject) => {
        db.end()
            .then(() => {
                resolve(); 
            })
            .catch(error => {
                reject(error); 
            });
    });
},10000);