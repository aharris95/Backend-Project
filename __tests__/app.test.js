const seed = require('../db/seeds/seed.js');
const {articleData, commentData, topicData, userData}   = require('../db/data/test-data');
const db = require('../db/connection');
const request = require('supertest');
const app = require('../db/app.js');
const sorted = require('jest-sorted');

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
                comment_count: 0
              });
            });
        });
        test('status:404, responds with article not found if id does not exist', () => {
            const ARTICLE_ID = 20;
            return request(app)
              .get(`/api/articles/${ARTICLE_ID}`)
              .expect(404)
              .then(({body: {msg}}) => {
                expect(msg).toBe(`No article found for article_id: ${ARTICLE_ID}`)
              });
          });
          test('status:400, responds with incorrect data type', () => {
            const ARTICLE_ID = 'a';
            return request(app)
              .get(`/api/articles/${ARTICLE_ID}`)
              .expect(400)
              .then(({body: {msg}}) => {
                expect(msg).toBe(`Incorrect data type`)
              });
          });
          test('status:404, responds with article not found if id equals 0', () => {
            const ARTICLE_ID = 0;
            return request(app)
              .get(`/api/articles/${ARTICLE_ID}`)
              .expect(404)
              .then(({body: {msg}}) => {
                expect(msg).toBe(`No article found for article_id: ${ARTICLE_ID}`)
              });
          });
      });
    describe('PATCH /api/articles/:article_id', () => {
        test('status:200, responds with the updated article if votes incremented', () => {
           const ARTICLE_ID = 1;
          const articleUpdates = {
            inc_votes: 1
          };
          return request(app)
            .patch(`/api/articles/${ARTICLE_ID}`)
            .send(articleUpdates)
            .expect(200)
            .then(({ body }) => {
              expect(body.article).toEqual({
                article_id: 1,
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                title: "Living in the shadow of a great man",
                votes: 101
              });
            });
        });
        test('status:200, responds with the updated article if votes decremented', () => {
            const ARTICLE_ID = 1;
           const articleUpdates = {
             inc_votes: -1
           };
           return request(app)
             .patch(`/api/articles/${ARTICLE_ID}`)
             .send(articleUpdates)
             .expect(200)
             .then(({ body }) => {
               expect(body.article).toEqual({
                 article_id: 1,
                 topic: "mitch",
                 author: "butter_bridge",
                 body: "I find this existence challenging",
                 created_at: "2020-07-09T20:11:00.000Z",
                 title: "Living in the shadow of a great man",
                 votes: 99
               });
             });
        })
        test('Status: 400 if PATCH body incorrect', () => {
            const ARTICLE_ID = 1;
            const articleUpdates = {
              votes: -1
            };
            return request(app).patch(`/api/articles/${ARTICLE_ID}`).expect(400).send(articleUpdates).then(({body: {msg}}) => {
                expect(msg).toBe("Incorrect PATCH body input")
            })
        })
        test('Status: 404 if article_id does not exist', () => {
            const ARTICLE_ID = 20;
            const articleUpdates = {
                inc_votes: -1
              };
            return request(app).patch(`/api/articles/${ARTICLE_ID}`).expect(404).send(articleUpdates).then(({body: {msg}}) => {
                expect(msg).toBe(`No article found for article_id: ${ARTICLE_ID}`)
            })
            })
      })
      describe('GET api/users', () => {
        test('Responds with 200 and array of objects', () => {
          return request(app).get("/api/users").expect(200).then(({body: {users}}) => {
          expect(users).toHaveLength(4);
          users.forEach((user) => {
               expect(user).toHaveProperty("username")
               expect(user).toHaveProperty("name")
               expect(user).toHaveProperty("avatar_url")
                })
           })
        })
      })
describe('GET api/articles', () => {
test('Responds with 200 and array of objects', () => {
    return request(app).get("/api/articles").expect(200).then(({body: {articles}}) => {
    expect(articles).toHaveLength(12);
    articles.forEach((article) => {
            expect(article).toHaveProperty("author")
            expect(article).toHaveProperty("title")
            expect(article).toHaveProperty("article_id")
            expect(article).toHaveProperty("topic")
            expect(article).toHaveProperty("created_at")
            expect(article).toHaveProperty("votes")
            expect(article).toHaveProperty("comment_count")
            })
        })
    })
    test('Responds with 200 and should be sorted by date in descending order as a default', ()=>{
        return request(app).get("/api/articles").expect(200).then(({body: {articles}})=>{
            expect(articles).toBeSortedBy('created_at', { descending: true, coerce: true})
        })
    })
})
describe("Routes that don't exist", () => {
    test('Responds with 404 for invalid path', () => {
        return request(app).get("/api/topicz").expect(404).then(({body: {msg}}) => {
            expect(msg).toBe("Invalid path")
        })
        })
    })
})
})