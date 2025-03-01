const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
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
  const blog = new Blog(request.body);
  if (!blog.likes) {
    blog.likes = 0;
  }

  if (!blog.title || !blog.author) {
    response.status(400).end();
  } else {
    const result = await blog.save();
    response.status(201).json(result);
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
