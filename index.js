const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");

const app = express();

// koneksi database
mongoose.connect("mongodb://127.0.0.1:27017/tugasDB");

// schema
const File = mongoose.model("File", {
  filename: String,
  originalname: String,
  size: Number,
  date: { type: Date, default: Date.now },
});

// upload config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// static file
app.use(express.static("uploads"));

app.get("/", async (req, res) => {
  const files = await File.find().sort({ date: -1 });

  let list = files.map((f, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${f.originalname}</td>
      <td>${(f.size / 1024).toFixed(2)} KB</td>
      <td>${new Date(f.date).toLocaleString()}</td>
      <td><a href="/${f.filename}" target="_blank">Download</a></td>
    </tr>
  `).join("");

  res.send(`
  <html>
  <head>
    <title>Web Tugas Naufal</title>

    <style>
      body {
        margin: 0;
        font-family: 'Segoe UI', sans-serif;
        color: white;
        background: #0b0f0d;
      }

      /* NAVBAR */
      .navbar {
        display: flex;
        justify-content: space-between;
        padding: 15px 30px;
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(10px);
        position: sticky;
        top: 0;
      }

      .logo {
        color: #00ff99;
        font-weight: bold;
        font-size: 18px;
      }

      .nav-links a {
        margin-left: 20px;
        color: white;
        text-decoration: none;
      }

      .nav-links a:hover {
        color: #00ff99;
      }

      /* HERO */
      .hero {
        background: url("https://images.unsplash.com/photo-1519861531473-9200262188bf") no-repeat center;
        background-size: cover;
        min-height: 100vh;
      }

      .overlay {
        background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.9));
        padding: 40px;
        min-height: 100vh;
      }

      h1 {
        font-size: 45px;
        color: #00ff99;
      }

      .subtitle {
        opacity: 0.8;
      }

      /* CARD */
      .card {
        background: rgba(0,255,100,0.1);
        padding: 20px;
        border-radius: 15px;
        margin-top: 25px;
        transition: 0.3s;
      }

      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 0 20px rgba(0,255,150,0.3);
      }

      /* BUTTON */
      button {
        background: #00ff99;
        border: none;
        padding: 10px 20px;
        border-radius: 10px;
        cursor: pointer;
        font-weight: bold;
      }

      button:hover {
        background: #00cc77;
      }

      /* TABLE */
      table {
        width: 100%;
        margin-top: 15px;
        border-collapse: collapse;
      }

      th, td {
        padding: 10px;
        border-bottom: 1px solid #444;
      }

      a {
        color: #00ff99;
      }

      .footer {
        text-align: center;
        padding: 20px;
        opacity: 0.6;
        font-size: 14px;
      }
    </style>
  </head>

  <body>

    <!-- NAVBAR -->
    <div class="navbar">
      <div class="logo">Web Tugas</div>
      <div class="nav-links">
        <a href="#">Beranda</a>
        <a href="#">Upload</a>
        <a href="#">Daftar</a>
      </div>
    </div>

    <!-- HERO -->
    <div class="hero">
      <div class="overlay">

        <h1>WEBSITE PENYIMPANAN TUGAS</h1>
        <p class="subtitle">Simpan & kelola tugas kamu dengan mudah</p>

        <p><b>Nama:</b> Naufal Fawwaz Firdausi</p>
        <p><b>NIM:</b> 2403010190</p>
        <p><b>Fakultas:</b> Informatika</p>

        <p style="color:#00ff99;"><i>"Disiplin mengalahkan segalanya."</i></p>

        <!-- UPLOAD -->
        <div class="card">
          <h2>Upload Tugas</h2>
          <form action="/upload" method="POST" enctype="multipart/form-data">
            <input type="file" name="file" required />
            <br><br>
            <button type="submit">Upload</button>
          </form>
        </div>

        <!-- LIST -->
        <div class="card">
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

    <div class="footer">
      © 2026 Naufal Fawwaz Firdausi
    </div>

  </body>
  </html>
  `);
});

app.post("/upload", upload.single("file"), async (req, res) => {
  const file = new File({
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: req.file.size,
  });

  await file.save();
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server jalan di http://localhost:3000");
});