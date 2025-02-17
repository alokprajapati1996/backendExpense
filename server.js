
const express=require("express");
require('dotenv').config()
const connectDB=require('./utils/config');
const cors=require('cors')
const userRouter=require("./router/userRouter")
const expenceRouter=require("./router/expenceRouter");
const { urlencoded } = require("body-parser");
const bodyParser = require("body-parser");
// const authRoutes=require("./router/authRoutes")

const app=express();

connectDB()

app.use(express.json());
app.use(urlencoded({extended:true}))
//app.use(bodyParser.json())
// const allwdOrigin=['http://localhost:5173']
//{origin:allwdOrigin,credentials:true}
app.use(cors())
app.use("/member",userRouter)
app.use("/myExpence",expenceRouter)
// app.use('/auth', authRoutes);
app.set('view engine', 'ejs');

const PORT=process.env.PORT
app.listen(PORT,()=>{
    console.log(`server is running port ${PORT}`);
    
})