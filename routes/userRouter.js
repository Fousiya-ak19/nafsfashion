const express=require("express");
const router=express.Router();
const userControllerr=require("../controllers/user/userController")


router.get("/pageNotFound",userControllerr.pageNotFound);
router.get("/",userControllerr.loadHomepage);




module.exports=router;