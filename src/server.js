import express from "express";

const PORT = 4000

const app = express();

const gossipMiddleware = (req, res, next) => {
  console.log("Middleware")
  next()
}

const handleHome = (req, res) => {
  return res.send("I alive")
}

app.get("/", gossipMiddleware, handleHome)

const handleListening = () => console.log(`Server listenting on port http://localhost:${PORT}`)

app.listen(PORT, handleListening)


