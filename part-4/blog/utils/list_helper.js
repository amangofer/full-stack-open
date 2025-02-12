const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  const mostLikes = Math.max(...blogs.map((blog) => blog.likes));
  const [mostLiked] = blogs.filter((blog) => blog.likes === mostLikes);
  return mostLiked ? mostLiked : {};
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {};

  const blogCounts = _.countBy(blogs, "author");
  const blogCountPairs = _.toPairs(blogCounts);
  const [topAuthor, maxBlogs] = _.maxBy(blogCountPairs, ([count]) => count);

  return {
    author: topAuthor,
    blogs: maxBlogs,
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {};

  const likesByAuthor = _.chain(blogs)
    .groupBy("author")
    .map((authorBlogs, author) => ({
      author,
      likes: _.sumBy(authorBlogs, "likes"),
    }))
    .value();

  const topAuthor = _.maxBy(likesByAuthor, "likes");

  return topAuthor;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
