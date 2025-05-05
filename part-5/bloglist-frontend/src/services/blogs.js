import axios from "axios";
const baseUrl = "/api/blogs";

let token;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const login = ({ username, password }) => {
  const request = axios.post("/api/login", { username, password });

  return request.then((response) => response.data);
};

const createBlog = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  };
  const respons = await axios.post(baseUrl, newBlog, config);
  return respons.data;
};

const updateBlog = async (updatedBlog) => {
  const respons = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog);
  console.log(respons.data);
  return respons.data;
};

export default { getAll, login, setToken, createBlog, updateBlog };
