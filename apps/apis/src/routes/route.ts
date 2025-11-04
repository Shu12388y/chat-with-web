import { Router } from "express";
import { Controller } from "../controllers/controller.js";


export const router:Router =  Router();



router.get("/health",(req,res)=>{
    res.status(200).json({message:"Healthy"})
});



router.post("/uri",Controller.getWebURI);
router.get("/status/:id",Controller.getStatus);
router.post("/chat/:id",Controller.chat);