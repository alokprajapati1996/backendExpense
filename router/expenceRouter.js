const express=require('express');
const { createExpence, expenceDelete, expenceUpdate, getAllExpence } = require('../controller/expenceControler');

const router=express.Router();

router.post('/create',createExpence)
router.delete('/deleteExpence/:id',expenceDelete)
router.put("/updateExpence/:id",expenceUpdate)
router.get("/allExpence",getAllExpence)

module.exports=router