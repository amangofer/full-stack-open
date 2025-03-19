const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const id = request.params.id;

  const blog = await Blog.findById(id).populate("user", {
    username: 1,
    name: 1,
  });

  if (blog) {
    response.json(blog);
  } else {
    response.status(404).json({
      error: "Document not found",
    });
  }
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;
  const user = request.user;

  if (!user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const blog = new Blog({
    title: body.title,
    url: body.url,
    author: body.author,
    likes: body.likes || 0,
    user: user.id,
  });

  if (!blog.title || !blog.author) {
    response.status(400).end();
  } else {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  const blogId = request.params.id;

  if (!request.user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const blog = await Blog.findById(blogId);
  if (!blog) {
    response.status(404).json({
      error: "Document not found",
    });
  } else if (blog.user.toString() === request.user.id.toString()) {
    await Blog.findByIdAndDelete(blogId);

    response.status(204).end();
  } else {
    response.status(401).json({ error: "Unauthorized to delete this blog" });
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const blogId = request.params.id;
  const blogBody = request.body;
  const blog = await Blog.findById(blogId);

  if (!blog) {
    return response.status(404).json({
      error: "Document not found",
    });
  }

  if (!request.user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  if (blog.user.toString() === request.user.id.toString()) {
    const res = await Blog.findByIdAndUpdate(blogId, blogBody, {
      new: true,
    });

    response.status(201).json(res);
  }
});

module.exports = blogsRouter;
