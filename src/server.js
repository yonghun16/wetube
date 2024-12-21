import express from "express";

const PORT = 4000

const app = express();

const handleHome = (req, res) => {
  return res.send("I alive")
}

const handleLogin = (req, res) => {
  return res.send("I login")
}
app.get("/", handleHome)
app.get("/login", handleLogin)

const handleListening = () => console.log(`Server listenting on port http://localhost:${PORT}`)

app.listen(PORT, handleListening)


