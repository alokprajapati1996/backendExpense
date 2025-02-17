const express=require('express');
const { loginUser, registerUser, userUpdate, userDelete, getAllUser,
     userSearchByEmail, userForgetePassword, 
     userResetPassword,
     resetPassword} = require('../controller/userController');
const router=express.Router();
//public route
router.post('/login',loginUser)
router.post('/signup',registerUser)
router.put("/updateUser/:id",userUpdate)
router.delete("/deleteUser/:id",userDelete)
router.get("/allUser",getAllUser)

 router.post("/password-reset",userForgetePassword)
 router.get("/resent/:id/:token",userResetPassword)
 router.post("/resent/:id/:token",resetPassword)
//  router.get("/reset/:id/:token",(req,res)=>{
//  })

module.exports=router