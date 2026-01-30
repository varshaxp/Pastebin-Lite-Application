import express from "express";
import { redis } from "../redis.js";
import { escapeHtml } from "../utils/escapeHtml.js";
import { nowMs } from "../utils/time.js";

const router = express.Router();

router.get("/p/:id", async (req, res) => {
  const key = `paste:${req.params.id}`;
  const data = await redis.hgetall(key);

  if (!data || !data.content) return res.sendStatus(404);
  if (data.expires_at && nowMs(req) > Date.parse(data.expires_at))
    return res.sendStatus(404);

  const views = await redis.hincrby(key, "views", 1);
  if (data.max_views && views > Number(data.max_views))
    return res.sendStatus(404);

  res.send(`<pre>${escapeHtml(data.content)}</pre>`);
});

export default router;
