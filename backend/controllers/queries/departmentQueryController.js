const {
  DepartmentReadModel,
} = require("../../models/nosql/departmentReadModel");

const getAllDepartments = async (req, res) => {
  try {
    const departments = await DepartmentReadModel.find();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const department = await DepartmentReadModel.findOne({
      departmentId: req.params.id,
    });

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
};
