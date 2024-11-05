import supertest from "supertest";
import app from "../build/app";
import DataBase from "../database/data-source";
import { Auth } from "../database/entity/models";
const request = supertest(app)

beforeAll(async ()=>{
    await DataBase.initialize()
})

describe("GET to registration and authentication forms", () => {
    test("getLogin - /auth/login", async ()=>{
        await request
        .get('/auth/login')
        .expect('Content-Type', /application\/json/)
        .expect(200)
    })
    test("getRegister - /auth/register", async ()=>{
        await request
        .get("/auth/register")
        .expect('Content-Type', /application\/json/)
        .expect(200)
    })
})

describe("POST on registration and authentication forms with user information", () => {
    test("postRegister - /auth/register/send", async ()=>{
        let response = await request.post("/auth/register/send").send({email: 'test@gmail.com',password: 'testing1234'})
        expect(200)
        expect(response.body).toHaveProperty("message")
        expect(response.body.message).toContain("The user has successfully registered.")
    })
    test("postLogin - /auth/login", async ()=>{
        let response = await request.post('/auth/login/send').send({email: 'test@gmail.com',password: 'testing1234'})
        expect(200)
        expect(response.body).toHaveProperty("validation")
        expect(response.body.validation.status).toBe(true)
    })
})

afterAll(async () => {
    await DataBase.getRepository(Auth).clear()
    await DataBase.destroy();
});

