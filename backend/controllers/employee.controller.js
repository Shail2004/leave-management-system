import { Employee } from "../models/employee.model.js";

export async function addEmployee(req, res, next) {
  try {
    const { name, email, department, joiningDate, leaveBalanceDays } = req.body;
    if (!name || !email || !department || !joiningDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const exists = await Employee.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already exists" });
    const emp = await Employee.create({
      name, email, department, joiningDate: new Date(joiningDate), leaveBalanceDays: leaveBalanceDays ?? 24
    });
    res.status(201).json(emp);
  } catch (e) { next(e); }
}

export async function listEmployees(req, res, next) {
  try {
    const items = await Employee.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
}

export async function getBalance(req, res, next) {
  try {
    const { id } = req.params;
    const emp = await Employee.findById(id);
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.json({ employeeId: emp._id, name: emp.name, leaveBalanceDays: emp.leaveBalanceDays });
  } catch (e) { next(e); }
}

export async function getByEmail(req, res, next) {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });
    const emp = await Employee.findOne({ email: String(email).toLowerCase() });
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.json(emp);
  } catch (e) { next(e); }
}
