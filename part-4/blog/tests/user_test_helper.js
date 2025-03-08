const User = require("../models/user");

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((note) => note.toJSON());
};

module.exports = {
  usersInDb,
};
