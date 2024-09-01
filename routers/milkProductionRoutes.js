// milkProductionRoutes.js
import  express from 'express';
const router = express.Router();
import  {getAllMilkProduction,addMilkProduction,updateMilkProductionById,deleteMilkProductionById}  from '../controller/milkProductionController.js';

router.get('/milk_production', getAllMilkProduction);
router.post('/addMilkProduction', addMilkProduction);
router.put('/updateMilkProductionById/:id', updateMilkProductionById);
router.delete('/milk-production/:id', deleteMilkProductionById);
export default router;