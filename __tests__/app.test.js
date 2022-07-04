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
        test('Status: 404 if PATCH body incorrect', () => {
            const ARTICLE_ID = 1;
            const articleUpdates = {
              votes: -1
            };
            return request(app).patch(`/api/articles/${ARTICLE_ID}`).expect(404).send(articleUpdates).then(({body: {msg}}) => {
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
 })

describe("Routes that don't exist", () => {
    test('Responds with 404 for invalid path', () => {
        return request(app).get("/api/topicz").expect(404).then(({body: {msg}}) => {
            expect(msg).toBe("Invalid path")
        })
        })
    })
})
