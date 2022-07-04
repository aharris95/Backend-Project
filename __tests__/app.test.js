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
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
             expect(topic).toHaveProperty("description")
            expect(topic).toHaveProperty("slug")
              })
         })
    })
})
describe('GET /api/articles/:article_id', () => {
    test('status:200, responds with a single matching article', () => {
      const ARTICLE_ID = 2;
      return request(app)
        .get(`/api/articles/${ARTICLE_ID}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            article_id: ARTICLE_ID,
            title: "Sony Vaio; or, The Laptop",
            topic: "mitch",
            author: "icellusedkars",
            body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
            created_at: "2020-10-16T05:03:00.000Z",
            votes: 0,
          });
        });
    });
    test('status:404, responds with article not found', () => {
        const ARTICLE_ID = 20;
        return request(app)
          .get(`/api/articles/${ARTICLE_ID}`)
          .expect(404)
          .then(({body: {msg}}) => {
            expect(msg).toBe(`No article found for article_id: ${ARTICLE_ID}`)
          });
      });
      test('status:404, responds with incorrect data type', () => {
        const ARTICLE_ID = 'a';
        return request(app)
          .get(`/api/articles/${ARTICLE_ID}`)
          .expect(404)
          .then(({body: {msg}}) => {
            expect(msg).toBe(`Incorrect data type`)
          });
      });
  });
describe("Routes that don't exist", () => {
    test('Responds with 404 for invalid path', () => {
        return request(app).get("/api/topicz").expect(404).then(({body: {msg}}) => {
            expect(msg).toBe("Invalid path")
        })
        })
    })
})
