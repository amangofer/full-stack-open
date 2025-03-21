const { test, after, beforeEach, afterEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const bcrypt = require("bcrypt");

const api = supertest(app);
const User = require("../models/user");

describe("User API Test", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    for (const user of helper.initialUsers) {
      const { username, name, password } = user;
      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        name,
        passwordHash,
      });
      await newUser.save();
    }
  });

  describe("Create user", async () => {
    const allUsers = await helper.usersInDb();
    console.log("after inital", allUsers);
    test.only("create a user with all valid input", async () => {
      const usersAtStart = await helper.usersInDb();
      await api
        .post("/api/users")
        .send(helper.newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();

      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);
    });

    //test.only("should fail with status 400 if the username is too short", async () => {
    //  await api
    //    .post("/api/users")
    //    .send(helper.userWithTooShortUsername)
    //    .expect(400);
    //});
    //
    //test.only("should fail with status 400 if the username is missing", async () => {
    //  await api.post("/api/users").send(helper.userWithOutUsername).expect(400);
    //});
    //
    //test.only("should fail with status 400 if the password is too short", async () => {
    //  await api
    //    .post("/api/users")
    //    .send(helper.userWithTooShortPassword)
    //    .expect(400);
    //});
    //
    //test.only("should fail with status 400 if the password is missing", async () => {
    //  await api.post("/api/users").send(helper.userWithOutPassword).expect(400);
    //});
    //
    //test.only("should fail with status 400 if username is not unique", async () => {
    //  await api
    //    .post("/api/users")
    //    .send(helper.notUniqueUser)
    //    .expect(400)
    //    .expect("Content-Type", /application\/json/);
    //});
  });
});

after(async () => {
  await mongoose.connection.close();
});
