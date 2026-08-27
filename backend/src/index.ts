import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
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

// 4. Router BetterAuth
app.all("/api/auth/{*any}", toNodeHandler(auth));

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

// Hanya jalankan listener saat running lokal (dev server)
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3001;
  app.listen(Number(port), "0.0.0.0", () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

export default app;
