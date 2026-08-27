import app from "./app.js";

const port = process.env.PORT || 3001;

if (process.env.NODE_ENV !== "production") {
  app.listen(Number(port), "0.0.0.0", () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}
