const { after, test, describe, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const helper = require("./user_test_helper");

const api = supertest(app);

describe("User API test", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("Create user", () => {
    test("create a user with all valid input", async () => {
      const newUser = {
        username: "aman",
        name: "amanuel",
        password: "password",
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const users = await helper.usersInDb();

      assert.strictEqual(newUser.username, users[0].username);
    });

    test("trying to create a user with invalid username returns 400", async () => {
      const newUser = {
        username: "am",
        name: "amanuel",
        password: "password",
      };

      await api.post("/api/users").send(newUser).expect(400);
    });

    test("trying to create a user with invalid password returns 400", async () => {
      const newUser = {
        username: "aman",
        name: "amanuel",
        password: "pa",
      };

      await api.post("/api/users").send(newUser).expect(400);
    });

    test("trying to create a user with existing username returns 400", async () => {
      const newUser = {
        username: "aman",
        name: "amanuel",
        password: "password",
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      await api.post("/api/users").send(newUser).expect(400);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
