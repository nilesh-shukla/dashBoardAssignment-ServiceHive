import { body } from "express-validator";
import { validateRequest } from "./auth.validation";

export const leadValidation = [
  body("name").trim().notEmpty().withMessage("Lead name is required"),
  body("email").trim().isEmail().withMessage("Please enter a valid email address for the lead"),
  body("phone").optional().trim(),
  body("company").optional().trim(),
  body("status")
    .optional()
    .isIn(["New", "Contacted", "Qualified", "Lost"])
    .withMessage("Status must be New, Contacted, Qualified, or Lost"),
  body("source")
    .trim()
    .isIn(["Website", "Instagram", "Referral"])
    .withMessage("Source must be Website, Instagram, or Referral"),
  validateRequest,
];

export const leadUpdateValidation = [
  body("name").optional().trim().notEmpty().withMessage("Lead name cannot be empty"),
  body("email").optional().trim().isEmail().withMessage("Please enter a valid email address"),
  body("phone").optional().trim(),
  body("company").optional().trim(),
  body("status")
    .optional()
    .isIn(["New", "Contacted", "Qualified", "Lost"])
    .withMessage("Status must be New, Contacted, Qualified, or Lost"),
  body("source")
    .optional()
    .trim()
    .isIn(["Website", "Instagram", "Referral"])
    .withMessage("Source must be Website, Instagram, or Referral"),
  validateRequest,
];
