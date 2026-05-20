import { Router } from "express";
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportCSV,
} from "../controllers/lead.controller";
import { leadValidation, leadUpdateValidation } from "../validations/lead.validation";
import { protect } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

// Protect all lead routes
router.use(protect);

// Order is critical! Expose export route before parameterized detail route.
router.get("/export", authorizeRoles("admin"), exportCSV);

router.get("/", getLeads);
router.post("/", leadValidation, createLead);

router.get("/:id", getLeadById);
router.put("/:id", leadUpdateValidation, updateLead);
router.delete("/:id", authorizeRoles("admin"), deleteLead);

export default router;
