import express from "express";
import {createVelage,getVelageByVacheId,deleteVelage,updateVelage} from "../controller/birthRegistrationController.js"
const router = express.Router();

router.post("/createVelage",createVelage);
router.get("/getVelageByVacheId",getVelageByVacheId);
router.put("/updateVelage/:vacheId",updateVelage);
router.delete("/deleteVelage/:vacheId",deleteVelage);
export default router;