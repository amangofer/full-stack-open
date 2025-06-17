import Blog from "./Blog";

const BlogList = ({ user, blogs, handleLike, handleRemove }) => {
  return (
    <div>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => {
          return (
            <Blog
              user={user}
              key={blog.id}
              blog={blog}
              handleLike={handleLike}
              handleRemove={handleRemove}
            />
          );
        })}
    </div>
  );
};

export default BlogList;
