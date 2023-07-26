const request = require("supertest");
const app = require("../app");
const mongoose = require('mongoose');

describe("Test the get allUsers path", () => {
  test("It should response the GET method", done => {
    request(app)
      .get("/users/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
