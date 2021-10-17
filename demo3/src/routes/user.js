const {Signup,Signin,getUser,deleteUser,updateUser,userVerify} = require("../controller/user")
const express = require("express")
const router = express.Router()


router.post("/Signup",Signup)
router.post("/Signin",Signin)
router.get("/getUser",getUser)
router.delete("/deleteUser/:id",deleteUser)
router.patch("/updateUser/:id",updateUser)
router.get("/userVerify/:token",userVerify)

module.exports = router