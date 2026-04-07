import express from "express";
import {
  upload,
  uploadSingle,
  uploadMultiple,
} from "../controller/upload.controller.js";

const router = express.Router();

router.post("/single", upload.single("image"), uploadSingle);
router.post("/multiple", upload.array("images", 20), uploadMultiple);

export default router;
