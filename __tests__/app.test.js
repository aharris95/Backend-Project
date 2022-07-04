const seed = require('../db/seeds/seed.js');
const {articleData, commentData, topicData, userData}   = require('../db/data/test-data');
const db = require('../db/connection');
const request = require('supertest');
const app = require('../db/app.js');

beforeEach(() => {
    return seed({articleData, commentData, topicData, userData});
  });
  
  afterAll(() => db.end());

  describe('NC-News',() => {
    describe('Get api/topics', () => {
      test('Responds with 200 and array of objects', () => {
return request(app).get("/api/topics").expect(200).then(({body: {topics}}) => {
topics.forEach((topic) => {
  expect(topic).toHaveProperty("description")
  expect(topic).toHaveProperty("slug")
        })
    })
})
})
})

  describe('NC-News',() => {
  describe('Bad path api/topics', () => {
    test('Responds with 404 for invalid path', () => {
return request(app).get("/api/topicz").expect(404).then(({body: {msg}}) => {
expect(msg).toBe("Invalid path")
})
})
})
})