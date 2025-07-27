import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { serveSwagger, setupSwagger } from './config/swagger.js';
import loginRoute from './routes/loginRoute.js';
import venueRoute from './routes/venueRoute.js';
import userRoute from './routes/userRoute.js';
import EventRouter from './routes/bookingRoute.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
    
app.use(cors());
app.use(express.json());

app.use('/docs', serveSwagger, setupSwagger);

app.use('/auth', loginRoute);
app.use('/venues', venueRoute);
app.use('/users', userRoute);
app.use('/events', EventRouter);

app.get('/', (req, res) => res.send('Welcome to EventNa Management system API!'));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
