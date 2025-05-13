const { AdminReadModel } = require("../../models/nosql/adminReadModel");

const getAdmins = async (req, res) => {
  try {
    const admins = await AdminReadModel.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminById = async (req, res) => {
  try {
    const admin = await AdminReadModel.findOne({ adminId: req.params.id });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdmins,
  getAdminById,
};
