import app from "../build/app";
import supertest from "supertest";
import DataBase from "../database/data-source";
import server from "../build/index"
import {createFilm, createPeople, createPeopleInFilms} from "./helpers";

const request = supertest(app)

beforeAll(async ()=>{
  await DataBase.initialize()
  await createFilm(100)
  await createPeopleInFilms(100)
  await createPeople(100)
  await request.post('/auth/login/send').send({email: 'test@gmail.com',password: 'testing1234'})
})

describe("req Get for routes the film", () => {
  test("getFilmsAll - Should returns the 6 movies, plus the one we created for the test environment", async ()=>{
    let response = await request.get('/film/s/all').expect(200)
    expect(response.body.results).toHaveLength(7)
  })

  test("getFilmById - Should return one movie correctly with characters on true ", async () => {
    let response = await request.get('/film/1').expect(200)
    expect(response.body.film.characters).toBe(true)
  },50000)

  test("getFilmsByName - Should returns a list with 4 results", async () => {
    let response = await request.get('/film/s/search').query({ searchFilm: 'a'}).expect(200)
    expect(response.body.results.length).toBe(4)
  })

  test("getFilmById - Should returns the correct error, if letters are entered when requesting the list of characters in a movie by id", async ()=>{
    let response = await request.get('/film/asd').expect(400)
    expect(response.body).toHaveProperty("error")
  })

  test("getFilmById - Should returns the correct error when entering a movie that does not exist.", async () => {
    let response = await request.get('/film/7').expect(404)
    expect(response.body).toHaveProperty("error")
  })

  test("getFilmsByName - Should returns an error in which no movie matches the searched title", async () => {
    let response = await request.get('/film/s/search').query({ searchFilm: 'qwerty'}).expect(404)
    expect(response.body).toHaveProperty("error")
  })
})

describe("req DELETE for routes Film",()=>{
  test("delFilmById - Comprueba que se eliminen los personajes relacionados con una película.", async () => {
    let response = await request.delete('/film/del/100').expect(200)
    expect(response.body).toHaveProperty("message")
  })

  test("delFilmById - Should returns an error when not finding characters for a movie", async () => {
    let response = await request.delete('/film/del/100').expect(404)
    expect(response.body).toHaveProperty("error")
    expect(response.body.error).toContain("The film title for test, does not have associated characters to eliminate.")
  })

  test("delFilmById - Should returns an error when not finding a movie to delete by searching for a string", async () => {
    let response = await request.delete('/film/del/qwerty').expect(400)
    expect(response.body).toHaveProperty("error")
    expect(response.body.error).toContain("The request \"qwerty\" is incorrect.") 
  })

  test("delFilmById - Should returns an error when not finding a movie", async () => {
    let response = await request.delete('/film/del/22').expect(404)
    expect(response.body).toHaveProperty("error")
    expect(response.body.error).toContain("The film with id 22 to delete not found.")
  })

  test("delFilmsAll - Should return all movies, their characters and their association are correctly deleted.", async () => {
    let response = await request.delete('/film/s/del/all').expect(200)
    expect(response.body).toHaveProperty("message")
    expect(response.body.message).toContain("Movies were deleted successfully")
  })

  test("delFilmsAll - Shoul return when requesting the movie deletion path for the second time is executed, an error is returned when the database is found to be empty of these movies..", async () => {
    await request.delete('/film/s/del/all')
    let response = await request.delete('/film/s/del/all').expect(404)
    expect(response.body).toHaveProperty("error")
    expect(response.body.error).toContain("Database has not movies to delete.")
  })
})

afterAll(async () => {
  await DataBase.destroy();
});