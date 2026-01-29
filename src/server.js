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