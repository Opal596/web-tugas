const express = require("express");
const app = express();

// TEST DOANG
app.get("/", (req, res) => {
  res.send("WEB HIDUP 🔥");
});

// PORT (WAJIB)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server jalan di port " + PORT);
});