import { Router } from "express";
import { addEmployee, listEmployees, getBalance, getByEmail } from "../controllers/employee.controller.js";

const router = Router();

router.post("/addEmployee", addEmployee);
router.get("/all", listEmployees);
router.get("/byEmail", getByEmail);
router.get("/:id/balance", getBalance);

export default router;
