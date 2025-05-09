import { useState } from "react";
import PropTypes from "prop-types";

const BlogForm = ({ handleSubmit }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const createNewBlog = async (event) => {
    event.preventDefault();
    const newBlog = {
      title,
      author,
      url,
    };

    handleSubmit(newBlog);
    setTitle("");
    setAuthor("");
    setUrl("");
  };
  return (
    <form onSubmit={createNewBlog}>
      <div>
        <label htmlFor="title">title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        <label htmlFor="author">author</label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        <label htmlFor="url">url</label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

BlogForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default BlogForm;
