const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const storeController = require("../controllers/storeController");

// routes/store.js

const upload = multer({ dest: "uploads/" });

// Chỉ nhận 1 file, field name phải là "id_file"
router.post("/upload", upload.single("id_file"), storeController.postUpload);

// Cấu hình lưu trữ file upload với Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Đổi tên file với timestamp
  },
});

// Định tuyến cho store
router.get("/", storeController.getStore);
router.post(
  "/upload",
  upload.single("productImage"),
  storeController.postUpload
);

module.exports = router;
