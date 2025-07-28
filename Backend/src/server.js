import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { serveSwagger, setupSwagger } from './config/swagger.js';
import loginRoute from './routes/loginRoute.js';
import venueRoute from './routes/venueRoute.js';
import userRoute from './routes/userRoute.js';
import EventRouter from './routes/bookingRoute.js';
import cateringRoute from './routes/cateringRoute.js';
import CustomerRoute from './routes/customerRoute.js';
import EmployeeRoute from './routes/employeeRoute.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
    
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('./uploads'));
app.use('/docs', serveSwagger, setupSwagger);

app.use('/api/auth', loginRoute);
app.use('/api/venues', venueRoute);
app.use('/api/users', userRoute);
app.use('/api/events', EventRouter);
app.use('/api/caterings', cateringRoute);
app.use('/api/customers', CustomerRoute);
app.use('/api/employees', EmployeeRoute);

app.get('/', (req, res) => res.send('Welcome to EventNa Management system API!'));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
