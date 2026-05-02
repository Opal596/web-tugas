const express = require("express");
const multer = require("multer");
const fs = require("fs");

const app = express();

const upload = multer({ dest: "uploads/" });

app.use(express.static(__dirname));
app.use("/uploads", express.static("uploads"));

// HALAMAN UTAMA
app.get("/", (req, res) => {
  const files = fs.readdirSync("uploads");

  let list = files.map(file => {
    return `
    <div style="margin-bottom:10px;">
      <a href="/uploads/${file}" target="_blank">${file}</a>
      <form action="/delete" method="POST" style="display:inline;">
        <input type="hidden" name="filename" value="${file}">
        <button style="background:red;color:white;border:none;padding:5px;">Hapus</button>
      </form>
    </div>
    `;
  }).join("");

  res.send(`
  <html>
  <head>
  <title>Web Tugas</title>
  <style>
    body {
      background: url('./background.jpg') center/cover no-repeat;
      color: white;
      font-family: Arial;
    }
    .overlay {
      background: rgba(0,0,0,0.7);
      padding: 20px;
      min-height: 100vh;
    }
    .profile {
      text-align:center;
      margin-bottom:20px;
    }
    .section {
      display:flex;
      gap:20px;
      align-items:center;
      flex-wrap:wrap;
    }
    img {
      width:200px;
    }
    .box {
      background: rgba(0,255,150,0.2);
      padding:15px;
      border-radius:10px;
    }
  </style>
  </head>

  <body>
  <div class="overlay">

    <div class="profile">
      <h1>Naufal Fawwaz Firdausi</h1>
      <p>NIM: 2403010190</p>
      <p>Fakultas: Teknik Informatika</p>
    </div>

    <div class="section">
      <img src="./giannis.png">
      <div class="box">
        <p>
        Giannis, Messi, Ronaldo sama-sama butuh makan ketika lapar,
        sama-sama butuh tidur ketika ngantuk.
        Tetapi mereka bisa menjadi manusia spesial di dunia ini.
        Kenapa kita nggak bisa?
        Yang menentukan bukan takdir, tapi perjuangan.
        </p>
        <p style="text-align:right;color:#00ff99;">
        — By Naufal Fawwaz Firdausi
        </p>
      </div>
    </div>

    <hr>

    <h2>Upload Tugas</h2>
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="file" required>
      <button>Upload</button>
    </form>

    <h3>Daftar File:</h3>
    ${list}

  </div>
  </body>
  </html>
  `);
});

// UPLOAD
app.post("/upload", upload.single("file"), (req, res) => {
  res.redirect("/");
});

// HAPUS FILE
app.use(express.urlencoded({ extended: true }));

app.post("/delete", (req, res) => {
  const filePath = "uploads/" + req.body.filename;
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  res.redirect("/");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server jalan di port " + PORT);
});