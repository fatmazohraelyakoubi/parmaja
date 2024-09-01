import express from 'express';
import { addCow, getAllCows,getCowByNumber,deleteCowById,updateCowById} from '../controller/cowsController.js';

const router = express.Router();


router.post('/addCow', addCow);
router.get('/getAllCows', getAllCows);
router.get('/getCow/:cowNumber', getCowByNumber);
router.delete('/deleteCowById/:cowId', deleteCowById);
router.put('/updateCowById/:cowId', updateCowById);
export default router;