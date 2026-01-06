import express from 'express';
import cors from 'cors';
import networkRoutes from './routes/network';
import validatorRoutes from './routes/validators';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.use('/network', networkRoutes);
app.use('/validators', validatorRoutes);

export default app;
