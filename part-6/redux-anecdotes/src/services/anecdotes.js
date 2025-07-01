import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createAnecdotes = async (content) => {
  const anecdoteObj = { content, votes: 0 };
  const respone = await axios.post(baseUrl, anecdoteObj);
  return respone.data;
};

export default { getAll, createAnecdotes };
