


import express from "express";
import cowsRoutes from "../backend/routers/cowsRoutes.js";
import healthChecksRoutes from '../backend/routers/healthChecksRoutes.js';
import  calvesRoutes  from  '../backend/routers/calvesRoutes.js';
import milkProductionRoutes from '../backend/routers/milkProductionRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';

// Create the Express app
export const app = express();

dotenv.config({ path: "./config/config.env" });

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/cowsRoutes', cowsRoutes);
app.use('/api/healthChecksRoutes', healthChecksRoutes);
app.use('/api/calvesRoutes', calvesRoutes);
app.use('/api/milkProductionRoutes', milkProductionRoutes);

