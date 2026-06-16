import { Request, Response } from "express";
import Job from "../models/Job";
import { AuthRequest } from "../middleware/auth.middleware";

export const getJobs = async (req: Request, res: Response) => {
  try {
    const { q, type, location } = req.query;

    const filter: any = { status: "OPEN" };

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { company: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: "i" };

    const jobs = await Job.find(filter)
      .populate("postedBy", "name email company")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name email company",
    );

    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const createJob = async (req: AuthRequest, res: Response) => {
  try {
    const { title, company, description, type, location, salary, skills } =
      req.body;

    if (!title || !company || !description || !type || !location) {
      res.status(400).json({ error: "All required fields must be filled" });
      return;
    }

    const job = await Job.create({
      title,
      company,
      description,
      type,
      location,
      salary,
      skills,
      postedBy: req.userId,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateJob = async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    if (job.postedBy.toString() !== req.userId) {
      res.status(403).json({ error: "Not authorized" });
      return;
    }

    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteJob = async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    if (job.postedBy.toString() !== req.userId) {
      res.status(403).json({ error: "Not authorized" });
      return;
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getMyJobs = async (req: AuthRequest, res: Response) => {
  try {
    const jobs = await Job.find({ postedBy: req.userId }).sort({
      createdAt: -1,
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
