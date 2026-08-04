import express, { Request, Response } from 'express';
import roomRoute from './routes/room.routes';
import sessionRoute from './routes/session.routes';

const app = express();
const port = process.env.PORT || 3001; // Kita gunakan 3001 karena frontend biasanya berjalan di 3000

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API Backend is running successfully!' });
});

app.use('/rooms', roomRoute);
app.use('/api/rooms', roomRoute);
app.use('/sessions', sessionRoute);
app.use('/api/sessions', sessionRoute);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
