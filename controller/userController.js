// src/controllers/authController.js
const express=require("express")
const app=express()
const User = require('../modles/UserModle');
const bcrypt=require('bcrypt')
 const jwt = require('jsonwebtoken');
const transporter = require('../utils/configEmail');


// Register new user
const getAllUser=async(req,res)=>{
    let users=await User.find();
    if(!users){
        return res.status(401).send({msg:"user not find!"})
    }
    return res.status(200).send({msg:"all user accessd! ",users,success:true})
}
const registerUser = async (req, res) => {
    const { username,email,phone,password,confirmPassword } = req.body;
    if(!username){
        return res.status(400).send({msg:"User name required",success:false})
    }
    if(!email){
        return res.status(400).send({msg:"User email required",success:false})
    }
    
    if(!phone){
        return res.status(400).send({msg:"User phone required",success:false})
    }
    if(!password){
        return res.status(400).send({msg:"User password required",success:false})
    }
    if(!confirmPassword){
        return res.status(400).send({msg:"User confirm password required",success:false})
    }

    if(!(password===confirmPassword)){
      return res.status(401).send({msg:"password and confrirm password dosen't match!"})
    }
    
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
            let saltRound=10;
           let hashPassword= await bcrypt.hash(password,saltRound)
        
        const user = await User.create({ username, email,phone,password:hashPassword });


     const token = jwt.sign({id:user._id},process.env.JWT_SECRET, { expiresIn: '1h' })

        // res.status(201).json({ user, token });
      return res.status(201).json({ user,token,msg:"user regiser sucessfully!" });
    } catch (error) {
        console.log(error);
        
       return res.status(500).json({ message: 'Server error', error });
    }
};


//  Login user and generate JWT
        const loginUser = async (req, res) => {
            const { email, password } = req.body;

            try {
                const user = await User.findOne({email});
                // if (!user || !(await user.matchPassword(password))) {
                //     return res.status(401).json({ message: 'Invalid credentials' });
                // }
        if(!user){
            return res.status(401).send({msg:"user not foud! "})
        }
        if(!password){
            return res.status(401).send({msg:"password not foud! "})
        }
        const isMatch = await bcrypt.compare(password,user.password)
         console.log(isMatch);
        

        // if(!compare){
        // return res.status(400).send({msg:"password not matched please enter right password"})
        // }
        // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // 
    //    res.status(200).json({ user, token });
       return res.status(200).send({msg:"user login succesfully",user,success:true });
    } catch (error) {
       return res.status(500).json({ msg: 'Server error', error });
    }
};

const userUpdate=async(req,res)=>{
const {id}=req.params;
const {username,email,phone,password}=req.body;
try {
    
const updateUser=await User.findByIdAndUpdate(id,{username,email,phone,password},{new:true});
if(!updateUser){
    return res.status(404).send('User not found');
}
return res.status(200).send({msg:"user updated succesfully!",updateUser,success:true})
} catch (error) {
    return res.status(400).send(error.message);
}

};


const userDelete=async(req,res)=>{
const {id}=req.params;
try {
    const user=await User.findByIdAndDelete(id);
    return res.status(200).json({message:"deleted successfully"})
} catch (error) {
    console.error("deletaion failld :",error)
}
};
const userSearchByEmail=async(req,res)=>{
    const {email}=req.body;
    try {
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({msg:"user not regiser!",success:false}) 
        }
        return res.status(200).json({msg:"user allready register!",user,success:true})
    } catch (error) {
        console.error("user failld :",error)
        return res.status(404).json({msg:"user failld!",succes:false})
    }
    };


const userForgetePassword=async(req,res)=>{
        const {email}=req.body;
        try {
            const user=await User.findOne({email});
            if(!user){
                
                 
                return res.status(400).json({msg:"user not regiser!",success:false}) 
            }
        
            
            const secret=user._id+process.env.JWT_SECRET;

            
                   const token=jwt.sign({id:user._id},secret,{expiresIn:'1h'});
                   user.passwordResetToken=token;
                    user.resetTokenExpiry=Date.now()+3600000;
                    console.log(user.passwordResetToken)
                    await user.save();
                    
                   const link=`http://localhost:8080/member/resent/${user._id}/${token}`
                   console.log(link);
                   //send email
                   try{
                   const info = await transporter.sendMail({
                    from:"alokprajapati913@gmail.com",
                    to:user.email,
                    subject: "Password Reset Request - Alok Shop",
                    html: `<p>Click the link below to reset your password:</p>
                           <a href=${link}>Reset Your Password</a>`,
                })
                return res.status(200).json({ msg: "please check your email!",info, success: true });
            }catch(error){
console.log("error occur",error);

            }
            return res.status(200).json({ msg: "Password reset link is not sent to your email!", success: false });
                  } catch (error) {
            console.error("Email failld :",error)
            return res.status(404).json({msg:"Email faild!",succes:false})
        }
        };

        
const userResetPassword=async(req,res)=>{
        const {id,token}=req.params
        
        try {
            const user=await User.findOne({passwordResetToken:token})
            if(!user){
                return res.status(200).send('token expired')
            }
            console.log(token);
        
            
            res.render('index',{email:user.email,id,token})
        } catch (error) {
            console.error("not render :",error)
            return res.status(404).json({msg:"email faild!",success:false})
        }
        };

const resetPassword = async (req, res) => {
            const { id, token } = req.params;
            const { password, confirmPassword } = req.body;
            console.log(password)
            console.log(confirmPassword)
        
            if (!password || !confirmPassword) {
                return res.status(400).json({ msg: "Please enter password and confirm password!" });
            }
        
            if (password !== confirmPassword) {
                return res.status(400).json({ msg: "Password and confirm password do not match!", success: false });
            }
        
            try {
                const user = await User.findOne({ passwordResetToken: token, resetTokenExpiry: { $gt: Date.now() } });
                if (!user) return res.status(400).send("Invalid or expired token");
                // Find user by ID
                const users = await User.findById(id);
        
                if (!users || user.passwordResetToken !== token) {
                    res.status(400).json({ msg: "Invalid or expired token!", success: false });
                }
        
                //Check if token is expired
                if (user.resetTokenExpiry < Date.now()) {
                    return res.status(400).json({ msg: "Token has expired. Please request a new one.", success: false });
                }
        
                // Hash new password
                const hashPassword = await bcrypt.hash(password, 10);
        
                // Update password and clear token fields
                user.password = hashPassword;
                user.passwordResetToken = null;
                //user.resetTokenExpiry = null;
                await user.save();
        
                res.json({msg:"password updated successfully",success:true});
        
            } catch (error) {
                console.error("Password update failed, please try again:", error);
                res.status(500).json({ msg: "Password update failed, please try again!", success: false });
            }
        };
            


module.exports = { registerUser, loginUser,userUpdate,userDelete ,
    getAllUser,userSearchByEmail, userForgetePassword,userResetPassword,resetPassword};
