import 'dotenv/config';
import express, { Request, Response } from 'express';
import roomRoute from './routes/room.routes';
import sessionRoute from './routes/sessions.routes';
import bookingsRoute from './routes/bookings.routes';
import bookingPriceRoute from './routes/bookingPrice.routes';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API Backend is running successfully!' });
});

app.use('/rooms', roomRoute)
app.use('/sessions', sessionRoute)
app.use('/bookings', bookingsRoute)
app.use('/booking-prices', bookingPriceRoute)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});