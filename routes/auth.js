const express = require("express")
const router = express.Router()
const db = require("../db")


// REGISTER
router.post("/register", (req, res) => {

const { name, email, password, role } = req.body

const sql = `
INSERT INTO users (name,email,password,role)
VALUES (?,?,?,?)
`

db.query(sql,[name,email,password,role],(err,result)=>{

if(err){
console.log(err)
return res.status(500).json(err)
}

res.json({
success:true,
message:"User Registered Successfully"
})

})

})


// LOGIN
router.post("/login", (req, res) => {

const { email, password } = req.body

const sql = "SELECT * FROM users WHERE email=?"

db.query(sql,[email],(err,result)=>{

if(err){
console.log(err)
return res.status(500).json(err)
}

if(result.length === 0){
return res.json({
success:false,
message:"User not found"
})
}

const user = result[0]

if(user.password !== password){
return res.json({
success:false,
message:"Invalid password"
})
}

res.json({
success:true,
user:user
})

})

})

module.exports = router