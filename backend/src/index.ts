import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3001; // Kita gunakan 3001 karena frontend biasanya berjalan di 3000

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API Backend is running successfully!' });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
