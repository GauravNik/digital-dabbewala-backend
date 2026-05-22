const express = require("express")
const cors = require("cors")

const authRoutes = require("./routes/auth")
const messRoutes = require("./routes/mess")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/mess", messRoutes)

app.use("/uploads", express.static("uploads"))

app.listen(3000, () => {
  console.log("Server running on port 3000")
})