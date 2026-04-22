import express from "express";
import { classifyName } from "../controllers/classifyController.js";

const router = express.Router();

router.get("/classify", classifyName);

export default router;