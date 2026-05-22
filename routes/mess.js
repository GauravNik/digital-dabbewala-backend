const express = require("express")
const router = express.Router()
const db = require("../db")
const multer = require("multer")

// image storage
const storage = multer.diskStorage({

destination: function(req,file,cb){
cb(null,"uploads/")
},

filename: function(req,file,cb){
cb(null,Date.now()+"-"+file.originalname)
}

})

const upload = multer({storage:storage})


// ADD MESS WITH IMAGE
router.post("/add", upload.single("image"), (req,res)=>{

const {messName,address,cuisine,price,description,provider_id} = req.body

const image = req.file ? req.file.filename : null

const sql = `
INSERT INTO mess (mess_name,address,cuisine,price,description,image,provider_id)
VALUES (?,?,?,?,?,?,?)
`

db.query(sql,[messName,address,cuisine,price,description,image,provider_id],(err,result)=>{

if(err){
console.log(err)
return res.status(500).json(err)
}

res.json({message:"Mess Added Successfully"})

})

})


// GET ALL MESSES
router.get("/all",(req,res)=>{

db.query("SELECT * FROM mess",(err,result)=>{

if(err){
return res.status(500).json(err)
}

res.json(result)

})

})

module.exports = router
// GET SINGLE MESS
router.get("/:id",(req,res)=>{

const id = req.params.id

db.query("SELECT * FROM mess WHERE id=?",[id],(err,result)=>{

if(err){
return res.status(500).json(err)
}

res.json(result[0])

})

})

router.get("/provider/:id",(req,res)=>{

const providerId = req.params.id

const sql = "SELECT * FROM mess WHERE provider_id=?"

db.query(sql,[providerId],(err,result)=>{

if(err){
return res.status(500).json(err)
}

res.json(result)

})

})


//Delete mess
router.delete("/delete/:id",(req,res)=>{

const id = req.params.id

db.query("DELETE FROM mess WHERE id=?",[id],(err,result)=>{

if(err){
return res.status(500).json(err)
}

res.json({message:"Mess deleted successfully"})

})

})

//update mess
router.put("/update/:id",(req,res)=>{

const id = req.params.id

const {messName,address,cuisine,price,description} = req.body

const sql = `
UPDATE mess
SET mess_name=?, address=?, cuisine=?, price=?, description=?
WHERE id=?
`

db.query(sql,[messName,address,cuisine,price,description,id],(err,result)=>{

if(err){
return res.status(500).json(err)
}

res.json({message:"Mess updated successfully"})

})

})

router.put("/update/:id",(req,res)=>{

const id = req.params.id

const {messName,address,cuisine,price,description} = req.body

const sql = `
UPDATE mess 
SET mess_name=?, address=?, cuisine=?, price=?, description=? 
WHERE id=?
`

db.query(sql,[messName,address,cuisine,price,description,id],(err,result)=>{

if(err){
console.log(err)
return res.status(500).json(err)
}

res.json({message:"Mess updated successfully"})

})

})

router.get("/:id",(req,res)=>{

const id = req.params.id

db.query("SELECT * FROM mess WHERE id=?",[id],(err,result)=>{

if(err) return res.status(500).json(err)

res.json(result[0])

})

})

router.post("/review",(req,res)=>{

const {mess_id,user_name,rating,comment} = req.body

const sql = `
INSERT INTO reviews (mess_id,user_name,rating,comment)
VALUES (?,?,?,?)
`

db.query(sql,[mess_id,user_name,rating,comment],(err,result)=>{

if(err){
console.log(err)
return res.status(500).json(err)
}

res.json({message:"Review added"})

})

})

router.get("/reviews/:messId",(req,res)=>{

const messId = req.params.messId

db.query("SELECT * FROM reviews WHERE mess_id=?",[messId],(err,result)=>{

if(err) return res.status(500).json(err)

res.json(result)

})

})

router.post("/subscribe",(req,res)=>{

const {user_id,mess_id} = req.body

const sql = `
INSERT INTO subscriptions (user_id,mess_id)
VALUES (?,?)
`

db.query(sql,[user_id,mess_id],(err,result)=>{

if(err){
console.log(err)
return res.status(500).json(err)
}

res.json({message:"Subscribed successfully"})

})

})

router.get("/subscribers/:messId",(req,res)=>{

const messId = req.params.messId

const sql = `
SELECT users.name, users.email
FROM subscriptions
JOIN users ON subscriptions.user_id = users.id
WHERE subscriptions.mess_id = ?
`

db.query(sql,[messId],(err,result)=>{

if(err) return res.status(500).json(err)

res.json(result)

})

})

router.get("/stats/:providerId",(req,res)=>{

const providerId = req.params.providerId

const stats = {}


// TOTAL MESSES
db.query(
"SELECT COUNT(*) as totalMess FROM mess WHERE provider_id=?",
[providerId],
(err,result1)=>{

if(err) return res.status(500).json(err)

stats.totalMess = result1[0].totalMess


// TOTAL SUBSCRIBERS
db.query(
`SELECT COUNT(*) as totalSubs 
FROM subscriptions 
JOIN mess ON subscriptions.mess_id = mess.id
WHERE mess.provider_id=?`,
[providerId],
(err,result2)=>{

if(err) return res.status(500).json(err)

stats.totalSubs = result2[0].totalSubs


// TOTAL REVIEWS
db.query(
`SELECT COUNT(*) as totalReviews
FROM reviews
JOIN mess ON reviews.mess_id = mess.id
WHERE mess.provider_id=?`,
[providerId],
(err,result3)=>{

if(err) return res.status(500).json(err)

stats.totalReviews = result3[0].totalReviews


res.json(stats)

})

})

})

})