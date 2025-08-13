import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true, index: true },
  type: { type: String, enum: ["ANNUAL"], default: "ANNUAL" },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  days: { type: Number, required: true, min: 1 },
  reason: { type: String, default: "" },
  status: { type: String, enum: ["PENDING","APPROVED","REJECTED"], default: "PENDING", index: true },
  decidedAt: { type: Date },
  decidedBy: { type: String }
}, { timestamps: true });

leaveSchema.index({ employee: 1, startDate: 1, endDate: 1 });

export const Leave = mongoose.model("Leave", leaveSchema);
