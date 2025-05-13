const Admin = require("../../models/sql/admin");
const { AdminReadModel } = require("../../models/nosql/adminReadModel");

const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields (name, email, password, role) are required",
      });
    }

    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin already exists with this email" });
    }

    const newAdmin = await Admin.create({ name, email, password, role });

    // Sync to MongoDB (NEVER include password!)
    await AdminReadModel.create({
      adminId: newAdmin.id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
    });

    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields (name, email, password, role) are required",
      });
    }

    const admin = await Admin.findByPk(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    admin.name = name;
    admin.email = email;
    admin.password = password;
    admin.role = role;

    await admin.save();

    // Update MongoDB (still never store password)
    await AdminReadModel.findOneAndUpdate(
      { adminId: admin.id },
      {
        name: admin.name,
        email: admin.email,
        role: admin.role,
      }
    );

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    await admin.destroy();

    await AdminReadModel.deleteOne({ adminId: admin.id });

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAdmin,
  updateAdmin,
  deleteAdmin,
};
