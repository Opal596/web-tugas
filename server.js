const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();

// 🔥 amanin folder uploads
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

app.use(express.static(__dirname));
app.use("/uploads", express.static(uploadDir));
app.use(express.urlencoded({ extended: true }));

// 🔥 ROUTE UTAMA (ANTI CRASH)
app.get("/", (req, res) => {
  let files = [];

  try {
    files = fs.readdirSync(uploadDir);
  } catch (err) {
    console.log("Error baca folder:", err);
  }

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

// upload
app.post("/upload", upload.single("file"), (req, res) => {
  res.redirect("/");
});

// delete
app.post("/delete", (req, res) => {
  const filePath = path.join(uploadDir, req.body.filename);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.log("Error hapus:", err);
  }

  res.redirect("/");
});

// 🔥 PORT RAILWAY
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server jalan di port " + PORT);
});