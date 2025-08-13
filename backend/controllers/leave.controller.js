import { Employee } from "../models/employee.model.js";
import { Leave } from "../models/leave.model.js";
import { businessDaysBetween, toDateOnly} from "../utils/utils_date.js";

export async function applyLeave(req, res, next) {
  try {
    const { employeeId, startDate, endDate, reason } = req.body;
    if (!employeeId || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const emp = await Employee.findById(employeeId);
    if (!emp) return res.status(404).json({ message: "Employee not found" });

    const start = toDateOnly(startDate);
    const end = toDateOnly(endDate);
    if (!start || !end) return res.status(400).json({ message: "Invalid dates" });
    if (end < start) return res.status(400).json({ message: "End date before start date" });
    if (start < toDateOnly(emp.joiningDate)) {
      return res.status(400).json({ message: "Cannot apply before joining date" });
    }

    const days = businessDaysBetween(start, end);
    if (!days || days <= 0) return res.status(400).json({ message: "No working days in selected range" });
    if (days > emp.leaveBalanceDays) {
      return res.status(400).json({ message: "Insufficient leave balance" });
    }

    const overlap = await Leave.exists({
      employee: emp._id,
      status: { $in: ["PENDING","APPROVED"] },
      startDate: { $lte: end },
      endDate: { $gte: start }
    });
    if (overlap) return res.status(409).json({ message: "Overlapping leave exists" });

    const leave = await Leave.create({
      employee: emp._id,
      startDate: start,
      endDate: end,
      days,
      reason: reason || ""
    });
    res.status(201).json(leave);
  } catch (e) { next(e); }
}

export async function listLeaves(req, res, next) {
  try {
    const { status, employeeId } = req.query;
    const q = {};
    if (status) q.status = status;
    if (employeeId) q.employee = employeeId;
    const items = await Leave.find(q).populate("employee", "name email department").sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
}

export async function approveLeave(req, res, next) {
  try {
    const { id } = req.params;
    const { decidedBy } = req.body;
    const leave = await Leave.findById(id).populate("employee");
    if (!leave) return res.status(404).json({ message: "Leave not found" });
    if (leave.status !== "PENDING") return res.status(400).json({ message: "Leave is not pending" });

    const emp = leave.employee;
    const start = toDateOnly(leave.startDate);
    const end = toDateOnly(leave.endDate);
    const overlap = await Leave.exists({
      employee: emp._id,
      status: "APPROVED",
      _id: { $ne: leave._id },
      startDate: { $lte: end },
      endDate: { $gte: start }
    });
    if (overlap) return res.status(409).json({ message: "Overlaps with approved leave" });

    if (leave.days > emp.leaveBalanceDays) {
      return res.status(400).json({ message: "Insufficient balance at approval time" });
    }

    leave.status = "APPROVED";
    leave.decidedAt = new Date();
    leave.decidedBy = decidedBy || "HR";
    await leave.save();

    emp.leaveBalanceDays -= leave.days;
    await emp.save();

    res.json(leave);
  } catch (e) { next(e); }
}

export async function rejectLeave(req, res, next) {
  try {
    const { id } = req.params;
    const { decidedBy } = req.body;
    const leave = await Leave.findById(id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });
    if (leave.status !== "PENDING") return res.status(400).json({ message: "Leave is not pending" });

    leave.status = "REJECTED";
    leave.decidedAt = new Date();
    leave.decidedBy = decidedBy || "HR";
    await leave.save();

    res.json(leave);
  } catch (e) { next(e); }
}
