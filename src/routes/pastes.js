import express from "express";
import crypto from "crypto";
import { redis } from "../redis.js";
import { validatePaste } from "../middlewares/validate.js";
import { nowMs } from "../utils/time.js";

const router = express.Router();

router.post("/pastes", validatePaste, async (req, res) => {
  const id = crypto.randomUUID();
  const key = `paste:${id}`;
  const created = new Date().toISOString();

  const expiresAt = req.body.ttl_seconds
    ? new Date(nowMs(req) + req.body.ttl_seconds * 1000).toISOString()
    : null;

  await redis.hset(key, {
    content: req.body.content,
    created_at: created,
    expires_at: expiresAt,
    max_views: req.body.max_views ?? null,
    views: 0,
  });

  if (req.body.ttl_seconds) {
    await redis.expire(key, req.body.ttl_seconds);
  }

  res.status(201).json({
    id,
    url: `${req.protocol}://${req.get("host")}/p/${id}`,
  });
});
router.get("/pastes/:id", async (req, res) => {
  const key = `paste:${req.params.id}`;

  const exists = await redis.exists(key);
  if (!exists) {
    return res.status(404).json({ error: "Paste expired or not found" });
  }

  const data = await redis.hgetall(key);

  // Time expiration check
  if (data.expires_at && nowMs(req) > Date.parse(data.expires_at)) {
    await redis.del(key);
    return res.status(410).json({ error: "Paste expired" });
  }

  const currentViews = Number(data.views || 0);
  const maxViews = Number(data.max_views || 0);

  if (maxViews && currentViews >= maxViews) {
    await redis.del(key);
    return res.status(410).json({ error: "Paste view limit reached" });
  }

  await redis.hincrby(key, "views", 1);

  res.json({
    content: data.content,
    remaining_views: maxViews ? maxViews - currentViews - 1 : null,
    expires_at: data.expires_at,
  });
});

// router.get("/pastes/:id", async (req, res) => {
//   const key = `paste:${req.params.id}`;
//   const data = await redis.hgetall(key);

//   if (!data || !data.content) {
//     return res.status(404).json({ error: "Not found" });
//   }

//   if (data.expires_at && nowMs(req) > Date.parse(data.expires_at)) {
//     return res.status(404).json({ error: "Not found" });
//   }

//   const views = await redis.hincrby(key, "views", 1);

//   if (data.max_views && views > Number(data.max_views)) {
//     return res.status(404).json({ error: "Not found" });
//   }

//   res.json({
//     content: data.content,
//     remaining_views: data.max_views ? Number(data.max_views) - views : null,
//     expires_at: data.expires_at,
//   });
// });

export default router;
