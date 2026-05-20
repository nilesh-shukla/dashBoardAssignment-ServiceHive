import { Request, Response, NextFunction } from "express";
import Lead from "../models/Lead";
import { convertLeadsToCSV } from "../utils/csvExport";

export const getLeads = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      status,
      source,
      search,
      sort = "latest",
      page = 1,
      limit = 10,
    } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (source) query.source = source;

    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: "i" } },
        { email: { $regex: search as string, $options: "i" } },
        { company: { $regex: search as string, $options: "i" } },
      ];
    }

    const pageSize = Number(limit);
    const skip = (Number(page) - 1) * pageSize;

    const sortOption = sort === "latest" ? { createdAt: -1 } : { createdAt: 1 };

    const leads = await Lead.find(query)
      .sort(sortOption as any)
      .skip(skip)
      .limit(pageSize);

    const total = await Lead.countDocuments(query);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: Number(page),
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const createLead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, phone, company, status, source } = req.body;

    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      status: status || "New",
      source,
    });

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const lead = await Lead.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const exportCSV = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    const csv = convertLeadsToCSV(leads);

    res.header("Content-Type", "text/csv");
    res.attachment("leads_export.csv");
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};
