const express = require("express");
const multer = require("multer");

const app = express();

// ================== UPLOAD CONFIG ==================
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// biar folder uploads bisa diakses
app.use(express.static("uploads"));

// ================== HALAMAN UTAMA ==================
app.get("/", (req, res) => {

  // sementara kosong (tanpa database)
  let list = "";

  res.send(`
  <html>
  <head>
    <title>Web Penyimpanan Tugas Naufal</title>

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

      h1 {
        color: #00ff99;
      }

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

      table {
        width: 100%;
        margin-top: 20px;
        border-collapse: collapse;
      }

      td, th {
        padding: 10px;
        border-bottom: 1px solid #444;
      }

      a {
        color: #00ff99;
      }
    </style>
  </head>

  <body>
    <div class="hero">
      <div class="overlay">

        <h1>WEBSITE PENYIMPANAN TUGAS</h1>

        <p>Nama: Naufal Fawwaz Firdausi</p>
        <p>NIM: 2403010190</p>
        <p>Fakultas: Teknik Informatika</p>

        <p><i>"Kerja keras hari ini adalah kesuksesan besok."</i></p>

        <div class="box">
          <h2>Upload Tugas</h2>
          <form action="/upload" method="POST" enctype="multipart/form-data">
            <input type="file" name="file" required />
            <br><br>
            <button type="submit">Upload</button>
          </form>
        </div>

        <div class="box">
          <h3>Daftar File</h3>
          <table>
            <tr>
              <th>No</th>
              <th>Nama File</th>
              <th>Ukuran</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
            ${list}
          </table>
        </div>

      </div>
    </div>
  </body>
  </html>
  `);
});

// ================== UPLOAD ==================
app.post("/upload", upload.single("file"), (req, res) => {
  // sementara belum pakai database
  res.redirect("/");
});

// ================== PORT ==================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server jalan di port " + PORT);
});