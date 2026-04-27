const express = require("express");
const multer = require("multer");
const fs = require("fs");

const app = express();

// ================== BUAT FOLDER UPLOAD ==================
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// ================== CONFIG UPLOAD ==================
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// biar file bisa diakses
app.use(express.static("uploads"));

// ================== HALAMAN UTAMA ==================
app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>Web Tugas Naufal</title>
    <style>
      body {
        margin: 0;
        font-family: Arial;
        color: white;
      }
      .hero {
        background: url("https://images.unsplash.com/photo-1504450758481-7338eba7524a") no-repeat center center;
        background-size: cover;
        min-height: 100vh;
      }
      .overlay {
        background: rgba(0,0,0,0.6);
        min-height: 100vh;
        padding: 30px;
      }
      h1 { color: #00ff99; }
      .box {
        background: rgba(0,255,100,0.1);
        padding: 20px;
        border-radius: 15px;
        margin: 20px auto;
        width: 80%;
      }
      button {
        background: #00ff99;
        border: none;
        padding: 10px 20px;
        border-radius: 10px;
        cursor: pointer;
      }
    </style>
  </head>

  <body>
    <div class="hero">
      <div class="overlay">

        <h1>WEBSITE PENYIMPANAN TUGAS</h1>

        <p>Nama: Naufal Fawwaz Firdausi</p>

        <div class="box">
          <h2>Upload File</h2>
          <form action="/upload" method="POST" enctype="multipart/form-data">
            <input type="file" name="file" required />
            <br><br>
            <button type="submit">Upload</button>
          </form>
        </div>

      </div>
    </div>
  </body>
  </html>
  `);
});

// ================== UPLOAD ==================
app.post("/upload", upload.single("file"), (req, res) => {
  res.redirect("/");
});

// ================== PORT ==================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server jalan di port " + PORT);
});