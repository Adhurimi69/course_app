const Department = require('../models/Department');

// Get all departments
exports.getAllDepartments = async (req, res) => {
    try {
      const departments = await Department.findAll();
      res.json(departments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch departments' });
    }
  };
  
  // Get department by ID
  exports.getDepartmentById = async (req, res) => {
    try {
      const { id } = req.params;
      const department = await Department.findByPk(id);
      
      if (!department) {
        return res.status(404).json({ error: 'Department not found' });
      }
  
      res.json(department);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch department' });
    }
  };
  
// Create a new department
exports.createDepartment = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if department with same name exists
    const existing = await Department.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({ error: 'Department name already exists' });
    }

    const newDepartment = await Department.create({ name });
    res.status(201).json(newDepartment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create department' });
  }
};

// Update a department
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    // Optional: prevent duplicate names
    if (name) {
      const existing = await Department.findOne({ where: { name } });
      if (existing && existing.id !== department.id) {
        return res.status(400).json({ error: 'Department name already exists' });
      }
    }

    department.name = name || department.name;
    await department.save();
    res.json(department);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update department' });
  }
};

// Delete a department
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    await department.destroy();
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete department' });
  }
};
