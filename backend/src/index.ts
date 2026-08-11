import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import roomRoute from "./routes/room.routes";
import sessionRoute from "./routes/sessions.routes";
import bookingsRoute from "./routes/bookings.routes";
import bookingPriceRoute from "./routes/bookingPrice.routes";
import userRoute from "./routes/user.routes";
import authRoute from "./routes/auth.routes";

const app = express();
const port = process.env.PORT || 3001;
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

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
