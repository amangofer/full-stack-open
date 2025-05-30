import { useState } from "react";

const Blog = ({ blog, handleLike, handleRemove }) => {
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
          <p className="blog-url">{blog.url}</p>
          <small className="blog-likes">likes {blog.likes}</small>
          <button
            onClick={() => {
              onLike(blog);
            }}
          >
            like
          </button>
          <p>{blog.user?.name}</p>
          <button onClick={() => onRemove(blog)}>remove</button>
        </div>
      )}
    </div>
  );
};

export default Blog;
