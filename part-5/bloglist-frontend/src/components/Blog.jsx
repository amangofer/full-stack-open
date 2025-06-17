import PropTypes from "prop-types";
import { useState } from "react";

const Blog = ({ user, blog, handleLike, handleRemove }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const onLike = (blog) => {
    handleLike(blog);
  };

  const onRemove = (blog) => {
    handleRemove(blog);
  };

  return (
    <div className="blog" style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
      </div>
      {visible && (
        <div>
          <a className="blog-url" href={blog.url}>
            {blog.url}
          </a>
          <div>
            <small className="blog-likes">likes {blog.likes}</small>
            <button
              onClick={() => {
                onLike(blog);
              }}
            >
              like
            </button>
          </div>
          <p>{blog.user.name}</p>
          {blog.user.username === user.username && (
            <button className="removebtn" onClick={() => onRemove(blog)}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object,
  addLike: PropTypes.func,
  removeBlog: PropTypes.func,
};

export default Blog;
