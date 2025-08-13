import { Router } from "express";
import { applyLeave, listLeaves, approveLeave, rejectLeave } from "../controllers/leave.controller.js";

const router = Router();

router.post("/apply", applyLeave);
router.get("/all", listLeaves);
router.patch("/:id/approve", approveLeave);
router.patch("/:id/reject", rejectLeave);

export default router;
