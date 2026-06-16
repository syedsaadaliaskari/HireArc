import { Router } from "express";
import {
  applyJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} from "../controllers/application.controller";
import { protect, employerOnly } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.post("/:jobId", protect, upload.single("cv"), applyJob);
router.get("/my", protect, getMyApplications);
router.get("/job/:jobId", protect, employerOnly, getJobApplications);
router.put("/:id", protect, employerOnly, updateApplicationStatus);

export default router;
