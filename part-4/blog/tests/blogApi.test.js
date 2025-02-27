const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");

const api = supertest(app);
const Blog = require("../models/blog");

describe("Blog API test", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are return", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("the unique identifier property of the blog posts is named id", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body[0].hasOwnProperty("id"), true);
  });

  test("addition of a new blog", async () => {
    const newBlog = {
      title: "Tools are not the Answer",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/10/04/CodeIsNotTheAnswer.html",
      likes: 7,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

    const contents = blogsAtEnd.map((b) => b.title);
    assert(contents.includes("Tools are not the Answer"));
  });

  test("if the like property is missing it will default to 0", async () => {
    const newBlog = {
      title: "Functional Classes in Clojure",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2023/01/19/functional-classes-clojure.html",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

    assert.strictEqual(blogsAtEnd[blogsAtEnd.length - 1].likes, 0);
  });

  test("fails with status code 400 if data invalid", async () => {
    const newBlog = {
      author: "Robert C. Martin",
      likes: 3,
    };

    await api.post("/api/blogs").send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
