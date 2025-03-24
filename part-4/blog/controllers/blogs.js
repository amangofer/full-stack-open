const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const { userExtractor } = require("../utils/middleware");

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

blogsRouter.post("/", userExtractor, async (request, response) => {
  const { title, url, author, likes } = request.body;
  const user = request.user;

  if (!title || !url) {
    return response.status(400).json({ error: "title or url is missing" });
  }

  const blog = new Blog({
    title,
    url,
    author,
    likes: likes || 0,
    user: user.id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    response.status(404).json({
      error: "Document not found",
    });
  } else if (blog.user.toString() === request.user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id);

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

  const updatedBlog = await Blog.findByIdAndUpdate(blogId, blogBody, {
    new: true,
  });
  response.status(201).json(updatedBlog);
});

module.exports = blogsRouter;
