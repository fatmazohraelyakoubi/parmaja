// healthChecksRoutes.js
import express from "express";
const router = express.Router();
import {getAllHealthChecks,addHealthCheck,updateHealthCheckById,deleteHealthCheckById} from '../controller/healthChecksController.js';

router.get('/health_checks',getAllHealthChecks);
router.post('/addHealthCheck',addHealthCheck);
router.put('/healthChecks/:id', updateHealthCheckById);
router.delete('/deleteHealthCheckById/:id',deleteHealthCheckById);
export default router;