const Department = require("../../models/sql/department");
const {
  DepartmentReadModel,
} = require("../../models/nosql/departmentReadModel");

const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;

    const existing = await Department.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({ error: "Department name already exists" });
    }

    const newDepartment = await Department.create({ name });

    // Sync to MongoDB
    await DepartmentReadModel.create({
      departmentId: newDepartment.id,
      name: newDepartment.name,
    });

    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    const department = await Department.findByPk(req.params.id);

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    // Prevent duplicate names
    if (name && name !== department.name) {
      const existing = await Department.findOne({ where: { name } });
      if (existing) {
        return res
          .status(400)
          .json({ error: "Department name already exists" });
      }
      department.name = name;
    }

    await department.save();

    // Update MongoDB
    await DepartmentReadModel.findOneAndUpdate(
      { departmentId: department.id },
      { name: department.name }
    );

    res.json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    await department.destroy();

    await DepartmentReadModel.deleteOne({ departmentId: department.id });

    res.json({ message: "Department deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
