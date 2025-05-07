const { UserReadModel } = require("../../models/nosql/userReadModel");

const getUsers = async (req, res) => {
  try {
    const users = await UserReadModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await UserReadModel.findOne({ userId: req.params.id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
};
