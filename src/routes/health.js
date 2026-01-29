import express from "express";
import { redis } from "../redis.js";

const router = express.Router();

router.get("/healthz", async (req, res) => {
  await redis.ping();
  res.json({ ok: true });
});

export default router;
