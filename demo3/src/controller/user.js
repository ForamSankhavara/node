const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")

exports.Signup = async(req,res) => {
    try{
        const user = new User(req.body)
        const token = jwt.sign({_id: user._id, }, process.env.JWT_KEY,{
            expiresIn:"2h"
        })
        const url = `http://localhost:2200/userVerify/${token}`
        await main(user.email,url)
        await user.save((error,data) => {
            if(error) return res.status(400).json({error})
            if(data) return res.status(200).json({message:"ragister sucessfully"})
        })
    }catch(e){
        console.log(e);
    }
}

exports.Signin = async(req,res) => {
    try{
        const email = req.body.email
        const password = req.body.password
        const _email = await User.findOne({email:email})
        if(_email != null){
            const isMatch = bcrypt.compareSync(password,_email.hash_password)
            if(isMatch){
                return res.status(200).json({_email,message:"user login successdully"})
            }else{
                return res.status(404).json({message:"invalide password"})
            }
        }else{
            return res.status(400).json({message:"invalide email"})
        }
    }catch(e){
        console.log(e);
    }
    
}

exports.getUser = async(req,res) => {
    try{
        const data = await User.find({})
        return res.status(200).json({data})
    }catch(e){
        console.log(e);
    }
}

exports.deleteUser = async(req,res) => {
    try{
        const id = req.params.id
        const data = await User.findByIdAndDelete(id)
        return res.status(200).json({data,message:"user deleted"})
    }catch(e){
        console.log(e);
    }
}

exports.updateUser = async(req,res) => {
    try{
        const id = req.params.id
        const data = await User.findByIdAndUpdate({_id:id},req.body,{
            new:true
        })   
        return res.status(200).json({data,meassage:"user updated"})
    }catch(e){
        console.log(e);
    }
}




async function main(email,url) {
    
    await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'foramsankhavara@gmail.com', // generated ethereal user
        pass: 'foram@2811', // generated ethereal password
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'foramsankhavara@gmail.com', // sender address
      to: email, // list of receivers
      subject: "User Verification", // Subject line
      text: "verification", // plain text body
    html: `${url}`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);

exports.userVerify = async(req,res) => {
    const token = req.params.token
    if(!token)
        return res.status(400).json({message:"token is required"})
        const user = jwt.verify(token, process.env.JWT_KEY)
        await User.updateOne({_id:user._id},{isVarified:1})
        return res.json({user,message:"user verified"})
}