const mongoose=require('mongoose')
const expenceSchema=new mongoose.Schema({
    expenceName:{
    type:String,
    require:true
},
price:{
    type:String,
    require:true
},
userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'member' }
},{timestamps:true})
const Expence=mongoose.model('myExpence',expenceSchema)
module.exports=Expence

