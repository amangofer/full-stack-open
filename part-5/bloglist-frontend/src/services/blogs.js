import axios from "axios";
const baseUrl = "/api/blogs";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const login = ({ username, password }) => {
  const request = axios.post("/api/login", { username, password });

  return request.then((response) => response.data);
};

export default { getAll, login };
