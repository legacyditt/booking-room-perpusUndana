import express, { Request, Response } from 'express';
import roomRoute from './routes/room.routes';

const app = express();
const port = process.env.PORT || 3001; // Kita gunakan 3001 karena frontend biasanya berjalan di 3000

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API Backend is running successfully!' });
});

app.use('rooms', roomRoute)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
