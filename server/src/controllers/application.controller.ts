import Application from "../models/Application";
import Job from "../models/Job";
import { AuthRequest } from "../middleware/auth.middleware";
import { Response } from "express";
import mongoose from "mongoose";

export const applyJob = async (req: AuthRequest, res: Response) => {
  try {
    const jobId = String(req.params.jobId);
    const userId = String(req.userId);
    const { coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    if (job.status === "CLOSED") {
      res.status(400).json({ error: "Job is closed" });
      return;
    }

    const existing = await Application.findOne({
      jobId: new mongoose.Types.ObjectId(jobId),
      userId: new mongoose.Types.ObjectId(userId),
    });
    if (existing) {
      res.status(400).json({ error: "Already applied for this job" });
      return;
    }

    const application = await Application.create({
      jobId: new mongoose.Types.ObjectId(jobId),
      userId: new mongoose.Types.ObjectId(userId),
      coverLetter,
      cvPath: req.file ? req.file.path : undefined,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getMyApplications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = String(req.userId);

    const applications = await Application.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .populate("jobId", "title company location type salary status")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getJobApplications = async (req: AuthRequest, res: Response) => {
  try {
    const jobId = String(req.params.jobId);
    const userId = String(req.userId);

    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    if (job.postedBy.toString() !== userId) {
      res.status(403).json({ error: "Not authorized" });
      return;
    }

    const applications = await Application.find({
      jobId: new mongoose.Types.ObjectId(jobId),
    })
      .populate("userId", "name email bio skills avatar")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateApplicationStatus = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const id = String(req.params.id);
    const userId = String(req.userId);
    const { status } = req.body;

    if (!["PENDING", "ACCEPTED", "REJECTED"].includes(status)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }

    const application = await Application.findById(id);
    if (!application) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    const job = await Job.findById(application.jobId.toString());
    if (!job || job.postedBy.toString() !== userId) {
      res.status(403).json({ error: "Not authorized" });
      return;
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
