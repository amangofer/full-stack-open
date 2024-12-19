import axios from "axios";

const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const create = (personObj) => {
  return axios.post(baseUrl, personObj).then((response) => response.data);
};

const update = (id, personObj) => {
  return axios
    .put(`${baseUrl}/${id}`, personObj)
    .then((response) => response.data);
};

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then((response) => response.data);
};

export default { getAll, create, remove, update };
