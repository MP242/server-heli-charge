const request = require("supertest");
const app = require("../app");
const mongoose = require('mongoose');
const User = require("../models/user.model");

describe("Test the user routes", () => {
  let testUser;

  test("It should create a new user", async () => {
    const user = {
      name: "TestUser",
      email: "testuser@example.com",
      password: "testpassword",
    };

    const res = await request(app).post("/users/").send(user);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");

    // Save the created user for future tests
    testUser = res.body;
  });

  afterEach(async () => {
    if (testUser) {
      await User.findByIdAndDelete(testUser._id);
    }
    await mongoose.connection.close();
  });
});
