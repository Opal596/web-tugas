const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();

// pastikan folder uploads ada
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// config upload
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.static("uploads"));

app.get("/", (req, res) => {

  let files = fs.readdirSync("uploads");
  let list = "";

  files.forEach((file, index) => {
    list += `
      <tr>
        <td>${index + 1}</td>
        <td>${file}</td>
        <td>
          <a href="/${file}" target="_blank">Lihat</a> |
          <a href="/delete/${file}" onclick="return confirm('Hapus file?')">Hapus</a>
        </td>
      </tr>
    `;
  });

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

      /* BACKGROUND BASKET CLEAN */
      .hero {
        background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)),
        url("https://images.unsplash.com/photo-1546519638-68e109498ffc") no-repeat center;
        background-size: cover;
        min-height: 100vh;
      }

      .overlay {
        padding: 30px;
      }

      h1 {
        color: #00ff99;
      }

      .identity {
        background: rgba(0,0,0,0.5);
        padding: 15px;
        border-radius: 10px;
        width: fit-content;
      }

      .box {
        background: rgba(0,255,100,0.1);
        padding: 20px;
        border-radius: 15px;
        margin: 20px auto;
        width: 80%;
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

      button {
        background: #00ff99;
        border: none;
        padding: 10px 20px;
        border-radius: 10px;
        cursor: pointer;
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

        <div class="identity">
          <p><b>Nama:</b> Naufal Fawwaz Firdausi</p>
          <p><b>NIM:</b> 2403010190</p>
          <p><b>Fakultas:</b> Teknik Informatika</p>
        </div>

        <div class="box">
          <h2>Upload File</h2>
          <form action="/upload" method="POST" enctype="multipart/form-data">
            <input type="file" name="file" required />
            <br><br>
            <button type="submit">Upload</button>
          </form>
        </div>

        <div class="box">
          <h2>Daftar File</h2>
          <table>
            <tr>
              <th>No</th>
              <th>Nama File</th>
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

app.post("/upload", upload.single("file"), (req, res) => {
  res.redirect("/");
});

app.get("/delete/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server jalan di http://localhost:3000");
});