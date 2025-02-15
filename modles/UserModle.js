const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    username:{
    type:String,
    require:true
},
email:{
    type:String,
    require:true,
    unique:true
},
phone:{
    type:String,
    require:true,
    unique:true
},
password:{
    type:String,
    require:true
},
},{timestamps:true})
userSchema.add({
    passwordResetToken:{
        type:String,
        default:null,
        // expires:'1h'

    },
    resetTokenExpiry: {
         type: Date }
})
const User=mongoose.model('member',userSchema)
module.exports=User

