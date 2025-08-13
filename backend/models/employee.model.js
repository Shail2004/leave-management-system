import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  department: { type: String, required: true, trim: true },
  joiningDate: { type: Date, required: true },
  leaveBalanceDays: { type: Number, default: 24, min: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export const Employee = mongoose.model("Employee", employeeSchema);
