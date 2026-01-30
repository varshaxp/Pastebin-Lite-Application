import "dotenv/config";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import health from "./routes/health.js";
import pastes from "./routes/pastes.js";
import view from "./routes/view.js";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(rateLimit({ windowMs: 60000, max: 100 }));

// Root route - landing / API info
app.get("/", (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  res.type("html").send(`
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Pastebin API</title></head>
    <body style="font-family: system-ui; max-width: 600px; margin: 2rem auto; padding: 0 1rem;">
      <h1>Pastebin API</h1>
      <p>Create and view pastes.</p>
      <h2>Endpoints</h2>
      <ul>
        <li><strong>GET</strong> <code>/api/healthz</code> — Health check</li>
        <li><strong>POST</strong> <code>/api/pastes</code> — Create a paste (body: <code>content</code>, optional <code>ttl_seconds</code>, <code>max_views</code>)</li>
        <li><strong>GET</strong> <code>/api/pastes/:id</code> — Get paste JSON</li>
        <li><strong>GET</strong> <code>/p/:id</code> — View paste as HTML</li>
      </ul>
      <p><a href="${baseUrl}/api/healthz">Check health</a></p>
    </body>
    </html>
  `);
});

app.use("/api", health);
app.use("/api", pastes);
app.use(view);

app.use((err, req, res, next) => {
  res.status(500).json({ error: "Internal error" });
});

export default app;

// Only start server if not in serverless environment (Vercel)
if (!process.env.VERCEL) {
  app.listen(process.env.PORT || 3000);
  console.log("Server is running...");
}