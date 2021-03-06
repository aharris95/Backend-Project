const seed = require("../db/seeds/seed.js");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../db/app.js");
const sorted = require("jest-sorted");
const e = require("express");

beforeEach(() => {
  return seed({ articleData, commentData, topicData, userData });
});

afterAll(() => db.end());

describe("NC-News", () => {
    describe("Get api/", () => {
        test("Responds with 200", () => {
            return request(app)
              .get("/api")
              .expect(200)
        })  
    })
  describe("Get api/topics", () => {
    test("Responds with 200 and array of objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(topic).toHaveProperty("description");
            expect(topic).toHaveProperty("slug");
          });
        });
    });
    describe("GET /api/articles/:article_id", () => {
      test("status:200, responds with a single matching article", () => {
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
              comment_count: 0,
            });
          });
      });
      test("status:404, responds with article not found if id does not exist", () => {
        const ARTICLE_ID = 20;
        return request(app)
          .get(`/api/articles/${ARTICLE_ID}`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(`No article found for article_id: ${ARTICLE_ID}`);
          });
      });
      test("status:400, responds with incorrect data type", () => {
        const ARTICLE_ID = "a";
        return request(app)
          .get(`/api/articles/${ARTICLE_ID}`)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(`Incorrect data type`);
          });
      });
      test("status:404, responds with article not found if id equals 0", () => {
        const ARTICLE_ID = 0;
        return request(app)
          .get(`/api/articles/${ARTICLE_ID}`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(`No article found for article_id: ${ARTICLE_ID}`);
          });
      });
    });
    describe("PATCH /api/articles/:article_id", () => {
      test("status:200, responds with the updated article if votes incremented", () => {
        const ARTICLE_ID = 1;
        const articleUpdates = {
          inc_votes: 1,
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
              votes: 101,
            });
          });
      });
      test("status:200, responds with the updated article if votes decremented", () => {
        const ARTICLE_ID = 1;
        const articleUpdates = {
          inc_votes: -1,
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
              votes: 99,
            });
          });
      });
      test("Status: 400 if PATCH body incorrect", () => {
        const ARTICLE_ID = 1;
        const articleUpdates = {
          votes: -1,
        };
        return request(app)
          .patch(`/api/articles/${ARTICLE_ID}`)
          .expect(400)
          .send(articleUpdates)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Incorrect PATCH body input");
          });
      });
      test("Status: 404 if article_id does not exist", () => {
        const ARTICLE_ID = 20;
        const articleUpdates = {
          inc_votes: -1,
        };
        return request(app)
          .patch(`/api/articles/${ARTICLE_ID}`)
          .expect(404)
          .send(articleUpdates)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(`No article found for article_id: ${ARTICLE_ID}`);
          });
      });
    });
    describe("GET api/users", () => {
      test("Responds with 200 and array of objects", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).toHaveLength(4);
            users.forEach((user) => {
              expect(user).toHaveProperty("username");
              expect(user).toHaveProperty("name");
              expect(user).toHaveProperty("avatar_url");
            });
          });
      });
    });
    describe("GET api/articles", () => {
      test("Responds with 200 and array of objects", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(12);
            articles.forEach((article) => {
              expect(article).toHaveProperty("author");
              expect(article).toHaveProperty("title");
              expect(article).toHaveProperty("article_id");
              expect(article).toHaveProperty("topic");
              expect(article).toHaveProperty("created_at");
              expect(article).toHaveProperty("votes");
              expect(article).toHaveProperty("comment_count");
            });
          });
      });
      test("Responds with 200 and should be sorted by date in descending order as a default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at", {
              descending: true,
              coerce: true,
            });
          });
      });
      test("Responds with 200 and should be sorted by votes in descending order", () => {
        return request(app)
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("votes", {
              descending: true,
              coerce: true,
            });
          });
      });
      test("Responds with 200 and should be sorted by votes in ascending order", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=ASC")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("votes", {
              descending: false,
              coerce: true,
            });
          });
      });
      test("Responds with 200 and should filter by topic", () => {
        return request(app)
          .get("/api/articles?filter=cats")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.every((article) => article.topic === "cats")).toBe(
              true
            );
          });
      });
      test("status:404, responds with incorrect query if query does not exist", () => {
        return request(app)
          .get(`/api/articles?filter=dogs`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(`Key does not exist`);
          });
      });
      test("status:404, responds with incorrect query if query does not exist", () => {
        return request(app)
          .get(`/api/articles?sort_by=dogs`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(`Key does not exist`);
          });
      });
    });
  });
  describe("GET api/articles/:article_id/comments", () => {
    test("Responds with 200 and array of objects", () => {
      const ARTICLE_ID = 1;
      return request(app)
        .get(`/api/articles/${ARTICLE_ID}/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(11);
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id");
            expect(comment).toHaveProperty("votes");
            expect(comment).toHaveProperty("created_at");
            expect(comment).toHaveProperty("author");
            expect(comment).toHaveProperty("body");
          });
        });
    });
    test("Responds with 200 and empty array if no comments on an article", () => {
      const ARTICLE_ID = 2;
      return request(app)
        .get(`/api/articles/${ARTICLE_ID}/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([]);
        });
    });
    test("status:404, responds with article not found if id does not exist", () => {
      const ARTICLE_ID = 20;
      return request(app)
        .get(`/api/articles/${ARTICLE_ID}/comments`)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(`No article found for article_id: ${ARTICLE_ID}`);
        });
    });
    test("status:400, responds with incorrect data type", () => {
      const ARTICLE_ID = "a";
      return request(app)
        .get(`/api/articles/${ARTICLE_ID}/comments`)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(`Incorrect data type`);
        });
    });
    test("status:404, responds with article not found if id equals 0", () => {
      const ARTICLE_ID = 0;
      return request(app)
        .get(`/api/articles/${ARTICLE_ID}/comments`)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(`No article found for article_id: ${ARTICLE_ID}`);
        });
    });
    describe("POST /api/articles/:article_id/comments", () => {
      test("status:201, responds with newly posted comment", () => {
        const ARTICLE_ID = 1;
        const newComment = {
          body: "New comment",
          author: "butter_bridge",
        };
        return request(app)
          .post(`/api/articles/${ARTICLE_ID}/comments`)
          .send(newComment)
          .expect(201)
          .then(({ body }) => {
            expect(body.comment).toEqual({
              ...newComment,
              article_id: ARTICLE_ID,
              votes: 0,
              created_at: body.comment.created_at,
              comment_id: 19,
            });
          });
      });
      test("status:201, checks that the new comment has been added to the database", () => {
        const ARTICLE_ID = 1;
        const newComment = {
          body: "New comment",
          author: "butter_bridge",
        };
        return request(app)
          .post(`/api/articles/${ARTICLE_ID}/comments`)
          .send(newComment)
          .expect(201)
          .then(() => {
            return request(app)
              .get(`/api/articles/${ARTICLE_ID}/comments`)
              .then((comments) => {
                const result = comments.body.comments.filter(
                  (element) => element.comment_id === 19
                );
                expect(result.length).toBe(1);
              });
          });
      });
      test("Returns a 400 when bad post body", () => {
        const ARTICLE_ID = 1;
        return request(app)
          .post(`/api/articles/${ARTICLE_ID}/comments`)
          .send({ some: "object" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Post body incorrect");
          });
      });
      test("status:404, responds with article not found if id does not exist", () => {
        const ARTICLE_ID = 20;
        const newComment = {
          body: "New comment 2",
          author: "butter_bridge",
        };
        return request(app)
          .post(`/api/articles/${ARTICLE_ID}/comments`)
          .send(newComment)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(`No article found for article_id: ${ARTICLE_ID}`);
          });
      });
      test("status:400, responds with incorrect data type", () => {
        const ARTICLE_ID = "a";
        return request(app)
          .post(`/api/articles/${ARTICLE_ID}/comments`)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(`Incorrect data type`);
          });
      });
      describe('DELETE /api/comments/:comment_id',() => {
        test('return 204 and check that the comment has been deleted from the database', ()=>{
            const COMMENT_ID = 1
            return request(app).delete(`/api/comments/${COMMENT_ID}`).expect(204).then(()=>{
                db.query('SELECT * FROM comments').then((data)=>{
                    expect(data.rows.some((element)=>{
                    element.comment_id === COMMENT_ID
                    })).toBe(false)
                })
            })
        })
        test("status:404, responds with article not found if id does not exist", () => {
            const COMMENT_ID = 50;
            return request(app)
              .delete(`/api/comments/${COMMENT_ID}`)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe(`No comment found for comment_id: ${COMMENT_ID}`);
              });
          });
          test("status:400, responds with incorrect data type", () => {
            const COMMENT_ID = "a";
            return request(app)
              .delete(`/api/comments/${COMMENT_ID}`)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe(`Incorrect data type`);
              });
          });
    });
    });
    describe("Routes that don't exist", () => {
      test("Responds with 404 for invalid path", () => {
        return request(app)
          .get("/api/topicz")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid path");
          });
      });
    });
  });
});
