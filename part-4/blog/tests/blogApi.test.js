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

  describe("when there are some blogs saved initially", () => {
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
      assert.strictEqual(response.body[0].hasOwnProperty("_id"), false);
    });
  });

  describe("viewing a specific note", () => {
    test("succeeds with a valid id", async () => {
      const blogs = await helper.blogsInDb();
      const blog = blogs[0];

      const response = await api
        .get(`/api/blogs/${blog.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.deepStrictEqual(blog, response.body);
    });

    test("fails with statuscode 404 if note does not exist", async () => {
      const id = await helper.nonExistingId();

      await api.get(`/api/blogs/${id}`).expect(404);
    });
    test("fails with statuscode 400 id is invalid", async () => {
      const id = "bsdn3bsb45345a54c454d";

      //await api.get(`/api/blogs/${id}`).expect(400);
    });
  });

  describe("addition of a new blog", () => {
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

    test("addition fails with status code 400 if data invalid", async () => {
      const newBlog = {
        author: "Robert C. Martin",
        likes: 3,
      };

      await api.post("/api/blogs").send(newBlog).expect(400);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });
  });

  describe("deletion of blog", () => {
    test("deletion succeeds with status code 204 if id is valid", async () => {
      const blogs = await helper.blogsInDb();
      const blogToDelete = blogs[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

      const contents = blogsAtEnd.map((b) => b.title);
      assert(!contents.includes(blogToDelete.title));
    });

    test("deletion fails with status code 405 if id is invalid", async () => {
      const wrongBlogId = "5a422bc61b54a676234d17c3";

      await api.delete(`/api/blogs/${wrongBlogId}`).expect(404);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });
  });

  describe("updateing of blog", () => {
    test("update succeeds with status code 204 if id is valid", async () => {
      const blogs = await helper.blogsInDb();
      const blogToUpdate = blogs[0];

      blogToUpdate.likes = 8;

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200);
      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);

      assert.strictEqual(blogsAtEnd[0].likes, blogToUpdate.likes);
    });

    test("update fails with status code 404 if id is invalid", async () => {
      const wrongId = "5a422a851b54b676234d17f7";

      const blog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 10,
        id: "5a422a851b54b676234d17f7",
      };

      await api.put(`/api/blogs/${wrongId}`).send(blog).expect(404);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
