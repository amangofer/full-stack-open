import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createAnecdotes = async (content) => {
  const anecdoteObj = { content, votes: 0 };
  const response = await axios.post(baseUrl, anecdoteObj);
  return response.data;
};

const updateVote = async (id) => {
  const toUpdate = await axios.get(`${baseUrl}/${id}`);
  const updated = { ...toUpdate.data, votes: toUpdate.data.votes + 1 };
  const response = await axios.put(`${baseUrl}/${id}`, updated);
  return response.data;
};

export default { getAll, createAnecdotes, updateVote };
