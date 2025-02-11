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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
