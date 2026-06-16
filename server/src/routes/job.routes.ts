import { Router } from "express";
import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
} from "../controllers/job.controller";
import { protect, employerOnly } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getJobs);
router.get("/my-jobs", protect, employerOnly, getMyJobs);
router.get("/:id", getJob);
router.post("/", protect, employerOnly, createJob);
router.put("/:id", protect, employerOnly, updateJob);
router.delete("/:id", protect, employerOnly, deleteJob);

export default router;
