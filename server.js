const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();

// pastikan folder uploads ada
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// setup upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// middleware
app.use(express.static(__dirname));
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));

// halaman utama
app.get("/", (req, res) => {
  const files = fs.readdirSync(uploadDir);

  let list = files.map(file => {
    return `
      <div>
        <a href="/uploads/${file}" target="_blank">${file}</a>
        <form action="/delete" method="POST" style="display:inline;">
          <input type="hidden" name="filename" value="${file}">
          <button>Hapus</button>
        </form>
      </div>
    `;
  }).join("");

  res.send(`
    <h2>Upload Tugas</h2>
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="file" required>
      <button>Upload</button>
    </form>

    <h3>Daftar File:</h3>
    ${list}
  `);
});

// upload file
app.post("/upload", upload.single("file"), (req, res) => {
  res.redirect("/");
});

// hapus file
app.post("/delete", (req, res) => {
  const filePath = path.join(uploadDir, req.body.filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  res.redirect("/");
});

// 🔥 WAJIB UNTUK RAILWAY (PALING BAWAH)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server jalan di port " + PORT);
});