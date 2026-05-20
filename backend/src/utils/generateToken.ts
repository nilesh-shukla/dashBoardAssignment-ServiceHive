import jwt from "jsonwebtoken";

export const generateToken = (id: string, role: string): string => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || "super_secret_key_for_smart_leads_dashboard_2026",
    {
      expiresIn: "7d",
    }
  );
};
