import { Parser } from "json2csv";
import { ILead } from "../models/Lead";

export const convertLeadsToCSV = (leads: ILead[]): string => {
  const fields = ["_id", "name", "email", "phone", "company", "status", "source", "createdAt", "updatedAt"];
  const opts = { fields };
  
  try {
    const parser = new Parser(opts);
    return parser.parse(leads);
  } catch (err: any) {
    console.error("Failed to parse leads to CSV:", err.message);
    throw new Error("CSV generation failed");
  }
};
