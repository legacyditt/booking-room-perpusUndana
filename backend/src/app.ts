import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { auth } from "./lib/auth.js";
import roomRoute from "./routes/room.routes.js";
import sessionRoute from "./routes/sessions.routes.js";
import bookingsRoute from "./routes/bookings.routes.js";
import bookingPriceRoute from "./routes/bookingPrice.routes.js";
import userRoute from "./routes/user.routes.js";
import authRoute from "./routes/auth.routes.js";
import uploadRoute from "./routes/upload.routes.js";
import workingDaysRoute from "./routes/workingDays.routes.js";
import settingsRoute from "./routes/settings.routes.js";
import adminActivityRoute from "./routes/adminActivity.routes.js";
import reportsRoute from "./routes/reports.routes.js";
import adminDatabaseRoute from "./routes/adminDatabase.routes.js";

const app = express();
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

// 1. Konfigurasi CORS
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  }),
);

// 2. Body Parser (harus sebelum route auth agar req.body terisi)
app.use(express.json());

// 3. Route Reset Password (wajib sebelum catch-all BetterAuth agar tidak ditangkap handler-nya)
app.use("/api/auth", authRoute);

// 4. Router BetterAuth (dynamic import: better-auth is ESM-only)
app.all("/api/auth/{/*any}", async (req, res) => {
  const { toNodeHandler } = await import("better-auth/node");
  return toNodeHandler(auth)(req, res);
});

// --- ROUTES APLIKASI ---
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API Backend is running successfully!" });
});

app.use("/rooms", roomRoute);
app.use("/sessions", sessionRoute);
app.use("/bookings", bookingsRoute);
app.use("/booking-prices", bookingPriceRoute);
app.use("/users", userRoute);
app.use("/uploads", uploadRoute);
app.use("/working-days", workingDaysRoute);
app.use("/settings", settingsRoute);
app.use("/admin-activity", adminActivityRoute);
app.use("/reports", reportsRoute);
app.use("/admin/database", adminDatabaseRoute);

export default app;
