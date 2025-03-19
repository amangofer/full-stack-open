const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const bcrypt = require("bcrypt");

const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");

describe("Blog API test", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("password", 10);
    const user = new User({
      username: "aman",
      name: "Amanuel",
      passwordHash,
    });
    await user.save();

    for (const blog of helper.initialBlogs) {
      const newBlog = new Blog({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes || 0,
        user: user.id,
      });
      await newBlog.save();
      user.blogs = user.blogs.concat(newBlog._id);
      await user.save();
    }
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

      assert.strictEqual(response.body[1].hasOwnProperty("id"), true);
      assert.strictEqual(response.body[0].hasOwnProperty("_id"), false);
    });
  });

  describe("viewing a specific note", () => {
    test("returns the blog with a valid id", async () => {
      const blogs = await helper.blogsInDb();
      const blog = blogs[0];

      const response = await api
        .get(`/api/blogs/${blog.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.deepStrictEqual(blog.id, response.body.id);
    });
    test("fails with statuscode 404 if note does not exist", async () => {
      const id = await helper.nonExistingId();

      await api.get(`/api/blogs/${id}`).expect(404);
    });
    test("fails with statuscode 400 id is invalid", async () => {
      const id = "bsdn3bsb45345a54c454d";

      await api.get(`/api/blogs/${id}`).expect(400);
    });
  });

  describe("addition of a new blog", () => {
    let user;
    beforeEach(async () => {
      user = await api
        .post("/login")
        .send({ username: "aman", password: "password" })
        .expect(200);
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
        .set("Authorization", `Bearer ${user.body.token}`)
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
        .set("Authorization", `Bearer ${user.body.token}`)
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

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${user.body.token}`)
        .send(newBlog)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });
  });

  describe("deletion of blog", () => {
    let user;
    beforeEach(async () => {
      user = await api
        .post("/login")
        .send({ username: "aman", password: "password" })
        .expect(200);
    });

    test("deletion succeeds with status code 204 if id is valid", async () => {
      const blogs = await helper.blogsInDb();
      const blogToDelete = blogs[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${user.body.token}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

      const contents = blogsAtEnd.map((b) => b.title);
      assert(!contents.includes(blogToDelete.title));
    });

    test("deletion fails with status code 405 if id is invalid", async () => {
      const wrongBlogId = "5a422bc61b54a676234d17c3";

      await api
        .delete(`/api/blogs/${wrongBlogId}`)
        .set("Authorization", `Bearer ${user.body.token}`)
        .expect(404);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });
  });

  describe("updateing of blog", () => {
    let user;
    beforeEach(async () => {
      user = await api
        .post("/login")
        .send({ username: "aman", password: "password" })
        .expect(200);
    });
    test("update succeeds with status code 201 if id is valid", async () => {
      const blogs = await helper.blogsInDb();
      const blogToUpdate = blogs[0];

      blogToUpdate.likes = 8;

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set("Authorization", `Bearer ${user.body.token}`)
        .send(blogToUpdate)
        .expect(201);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);

      assert.strictEqual(blogsAtEnd[0].likes, blogToUpdate.likes);
    });
    test("update fails with status code 404 if id does not exist", async () => {
      const wrongId = await helper.nonExistingId();

      await api
        .put(`/api/blogs/${wrongId}`)
        .set("Authorization", `Bearer ${user.body.token}`)
        .send({})
        .expect(404);
    });

    test("fails with statuscode 400 id is invalid", async () => {
      const invalidId = "5a422a851b54b676234d1";

      const blog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 10,
        id: "5a422a851b54b676234d17f7",
      };

      await api
        .put(`/api/blogs/${invalidId}`)
        .set("Authorization", `Bearer ${user.body.token}`)
        .send(blog)
        .expect(400);
    });
  });
});

//
after(async () => {
  await mongoose.connection.close();
});
