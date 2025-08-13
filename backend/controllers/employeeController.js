const Employee = require("../models/Employee");
const { allowedPositions } = require("../models/Employee");

// Escape regex special chars so search can't break the regex
const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/employees?search=term
exports.getEmployees = async (req, res) => {
  try {
    const search = (req.query.search || "").trim();
    let filter = {};

    if (search) {
      const regex = new RegExp(escapeRegExp(search), "i");
      filter = {
        $or: [
          { name: regex },
          { email: regex },
          { position: regex }
        ]
      };
    }

    const employees = await Employee.find(filter).sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/employees
exports.addEmployee = async (req, res) => {
  try {
    const { name, email, position } = req.body;

    if (!name || !email || !position) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (!/^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com)$/.test(email)) {
      return res.status(400).json({ error: "Email must be @gmail.com or @outlook.com" });
    }
    if (!allowedPositions.includes((position || "").trim())) {
      return res.status(400).json({ error: "Invalid position" });
    }

    const employee = await Employee.create({ name: name.trim(), email: email.trim(), position: position.trim() });
    res.status(201).json(employee);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/employees/:id
exports.updateEmployee = async (req, res) => {
  try {
    const { name, email, position } = req.body;

    if (!name || !email || !position) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (!/^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com)$/.test(email)) {
      return res.status(400).json({ error: "Email must be @gmail.com or @outlook.com" });
    }
    if (!allowedPositions.includes((position || "").trim())) {
      return res.status(400).json({ error: "Invalid position" });
    }

    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { name: name.trim(), email: email.trim(), position: position.trim() },
      { new: true, runValidators: true, context: "query" }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/employees/:id
exports.deleteEmployee = async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
