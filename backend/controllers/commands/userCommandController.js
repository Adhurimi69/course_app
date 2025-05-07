const User = require("../../models/sql/user");
const { UserReadModel } = require("../../models/nosql/userReadModel");

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields (name, email, password, role) are required",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const newUser = await User.create({ name, email, password, role });

    // Sync to MongoDB (NEVER include password!)
    await UserReadModel.create({
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields (name, email, password, role) are required",
      });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.email = email;
    user.password = password;
    user.role = role;

    await user.save();

    // Update MongoDB (still never store password)
    await UserReadModel.findOneAndUpdate(
      { userId: user.id },
      {
        name: user.name,
        email: user.email,
        role: user.role,
      }
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    await UserReadModel.deleteOne({ userId: user.id });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
};
