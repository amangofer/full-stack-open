const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

const newBlog = {
  title: "Tools are not the Answer",
  author: "Robert C. Martin",
  url: "http://blog.cleancoder.com/uncle-bob/2017/10/04/CodeIsNotTheAnswer.html",
  likes: 7,
};
const blogWithOutLikes = {
  title: "Tools are not the Answer",
  author: "Robert C. Martin",
  url: "http://blog.cleancoder.com/uncle-bob/2017/10/04/CodeIsNotTheAnswer.html",
};
const blogWithOutTitle = {
  author: "Robert C. Martin",
  url: "http://blog.cleancoder.com/uncle-bob/2017/10/04/CodeIsNotTheAnswer.html",
  likes: 7,
};

const blogWithOutUrl = {
  title: "Tools are not the Answer",
  author: "Robert C. Martin",
  likes: 7,
};

const nonExistingId = async () => {
  const blog = new Blog({ id: "6a822bc55c34a676234d5b4b3" });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blog = await Blog.find({});
  return blog.map((note) => note.toJSON());
};

const initialUsers = [
  {
    username: "user",
    name: "user 1",
    password: "password",
  },
  {
    username: "user2",
    name: "user 2",
    password: "password",
  },
];

const loginUser = {
  username: "user",
  password: "password",
};

const newUser = {
  username: "user3",
  name: "user 3",
  password: "password",
};

const notUniqueUser = {
  username: "user4",
  name: "user 4",
  password: "password",
};
const userWithOutUsername = {
  name: "user 4",
  password: "password",
};

const userWithTooShortUsername = {
  username: "u4",
  name: "user 4",
  password: "password",
};

const userWithOutPassword = {
  username: "user4",
};

const userWithTooShortPassword = {
  username: "user5",
  password: "pa",
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((note) => note.toJSON());
};
module.exports = {
  initialBlogs,
  newBlog,
  blogWithOutTitle,
  blogWithOutUrl,
  blogWithOutLikes,
  nonExistingId,
  blogsInDb,
  initialUsers,
  loginUser,
  newUser,
  notUniqueUser,
  userWithOutUsername,
  userWithTooShortUsername,
  userWithOutPassword,
  userWithTooShortPassword,
  usersInDb,
};
