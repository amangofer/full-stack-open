const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const id = request.params.id;

  const blog = await Blog.findById(id);

  if (blog) {
    response.json(blog);
  } else {
    response.status(404).json({
      status: "error",
      message: "Document not found",
    });
  }
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  const user = await User.findById(body.userId);

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
    //user.blogs = user.blogs.concat(savedBlog._id);
    //await user.save();
    response.status(201).json(savedBlog);
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  const blogId = request.params.id;

  const blog = await Blog.findByIdAndDelete(blogId);
  if (!blog) {
    response.status(404).json({
      status: "error",
      message: "Document not found",
    });
  } else {
    response.status(204).end();
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const blogBody = request.body;
  const blogId = request.params.id;

  const updatedBlog = await Blog.findByIdAndUpdate(blogId, blogBody, {
    new: true,
  });
  if (!updatedBlog) {
    response.status(404).json({
      status: "error",
      message: "Document not found",
    });
  } else {
    response.json(updatedBlog);
  }
});

module.exports = blogsRouter;
