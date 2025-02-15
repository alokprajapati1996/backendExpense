// src/controllers/authController.js
const mongoose = require('mongoose');
const Expence = require('../modles/expenceModle');

const getAllExpence =  async(req,res)=>{
    let expences=await Expence.find()
    if(!expences){
        return res.status(401).send({msg:"expence not find!"})
    }
    return res.status(200).send({msg:"all expence accessd! ",expences,success:true})
}
const createExpence = async (req, res) => {
    const { expenceName,price, userId } = req.body;
    if(!expenceName){
        return res.status(400).send({msg:"Expence is required",success:false})
    }
    if(!price){
        return res.status(400).send({msg:"price required",success:false})
    }
    
    if(!userId){
        return res.status(400).send({msg:"UserId required",success:false})
    }

    
    
    try {
        const expence = await Expence.create({ expenceName,price, userId });
        return res.status(201).json({ expence ,msg:'expence created successfully',success:true});
} catch (error) {
    console.log(error);
        
       return res.status(500).json({ message: 'Server error', error });
    }
}

const expenceUpdate = async (req, res) => {
    const {id} = req.params;
    const { expenceName, price } = req.body;

    try {
        // // Validate ID format
        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //     return res.status(400).send({ msg: "Invalid ID format" });
        // }

        // Validate required fields
        if (!expenceName || !price) {
            return res.status(400).send({ msg: "All fields are required" });
        }
            
        const expenceUpdates = await Expence.findByIdAndUpdate(
            id,
            { expenceName, price },
            { new: true }
        );

        if (!expenceUpdates) {
            return res.status(404).send({ msg: "Expense not found" });
        }

        return res.status(200).send({
            msg: "Expense updated successfully!",
            expenceUpdates,
            success: true,
        });
    } catch (error) {
        console.error("Error updating expense:", error);
        return res.status(500).send({
            msg: "Internal server error",
            error: error.message,
        });
    }
};
const expenceDelete=async(req,res)=>{
const {id}=req.params;
try {
    const expence=await Expence.findByIdAndDelete(id);
    return res.status(200).json({message:"deleted successfully"})
} catch (error) {
    console.error("deletaion failld :",error)
}
};

module.exports = {expenceDelete,expenceUpdate,createExpence,getAllExpence};
