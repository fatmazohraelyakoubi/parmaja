// calvesRoutes.js
import express from "express";
import {getAllCalves,addCalf,updateCalfById,deleteCalfById} from '../controller/calvesController.js';
const router = express.Router();
router.get('/calves',getAllCalves);
router.post('/addCalf',addCalf);
router.put('/calves/:calfId', updateCalfById);
router.delete('/deleteCalfById/:calfId', deleteCalfById);
export default router;