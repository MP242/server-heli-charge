const request = require("supertest");
const app = require("../app");
const mongoose = require('mongoose');

describe("Test the root path", () => {
  test("It should response the GET method", done => {
    request(app)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
