import { useState, useEffect, useRef } from "react";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import { jwtDecode } from "./services/helper";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import BlogList from "./components/BlogList";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const blogFormRef = useRef();

  useEffect(() => {
    const fetch= async ()=>{
    // await blogService.getAll().then((blogs) => setBlogs(blogs));
      try{
      const data = await blogService.getAll()
      setBlogs(data)
      }catch(e){
        setErrorMessage(e.response.data.error);
        setTimeout(() => {
          setErrorMessage(null);
      }, 5000);
      }finally{
        setLoading(false)
      }
    }
    fetch()
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      const decoded = jwtDecode(user.token);
      if (!decoded.exp || Date.now() >= decoded.exp * 1000) {
        setUser(null);
        blogService.setToken("");
        window.localStorage.removeItem("loggedNoteappUser");
        return;
      }
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await blogService.login({ username, password });

      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (e) {
      setErrorMessage(e.response.data.error);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedNoteappUser");
    setUser(null);
    blogService.setToken("");
  };

  const createNewBlog = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility();
      const savedBlog = await blogService.createBlog(newBlog);
      setBlogs(blogs.concat(savedBlog));
      setSuccessMessage(
        `a new blog ${newBlog.title} by ${newBlog.author} added`,
      );
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (e) {
      setErrorMessage(e.response.data.error);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    };

    try {
      const updated = await blogService.updateBlog(updatedBlog);
      setBlogs(blogs.map((b) => (b.id === updated.id ? updated : b)));
    } catch (e) {
      setErrorMessage(e.response.data.error);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleRemove = async (removedBlog) => {
    try {
      if (
        window.confirm(
          `Remove blog ${removedBlog.title} by ${removedBlog.author}`,
        )
      ) {
        await blogService.deleteBlog(removedBlog);
        setBlogs(blogs.filter((blog) => blog.id !== removedBlog.id));
      }
    } catch (e) {
      setErrorMessage(e.response.data.error);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

if(loading){
    return <p>Lodding...</p>
  }

  if (user === null) {
    return (
      <div>
        <h2>login to application</h2>
        <Notification status="error" message={errorMessage} />
        <form action="#" onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              data-testid="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              data-testid="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification status="error" message={errorMessage} />
      <Notification status="success" message={successMessage} />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>Logout</button>
      </p>
      <Togglable buttonLabel="New Blog" ref={blogFormRef}>
        <BlogForm handleSubmit={createNewBlog} />
      </Togglable>
      <BlogList
        user={user}
        blogs={blogs}
        handleLike={handleLike}
        handleRemove={handleRemove}
      />
    </div>
  );
};

export default App;
