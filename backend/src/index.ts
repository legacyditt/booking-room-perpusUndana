import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import roomRoute from "./routes/room.routes";
import sessionRoute from "./routes/sessions.routes";
import bookingsRoute from "./routes/bookings.routes";
import bookingPriceRoute from "./routes/bookingPrice.routes";

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

// 2. Router BetterAuth
app.all("/api/auth/*", toNodeHandler(auth));

// 3. Body Parser
app.use(express.json());

// --- ROUTES APLIKASI ---
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API Backend is running successfully!" });
});

app.use("/rooms", roomRoute);
app.use("/sessions", sessionRoute);
app.use("/bookings", bookingsRoute);
app.use("/booking-prices", bookingPriceRoute);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
