const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const userController = require("../controllers/userController");

// Cấu hình multer: lưu file vào public/uploads, đặt tên file có timestamp
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + "-" + Date.now() + ext;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Hiển thị danh sách tài khoản
router.get("/", userController.getAllUsers);

// Form tạo user mới
router.get("/create", userController.showCreateForm);
router.post("/create", upload.single("avatar"), userController.createUser);

// Form chỉnh sửa user
router.get("/edit/:id", userController.showEditForm);
router.post("/edit/:id", upload.single("avatar"), userController.updateUser);

// Xoá tài khoản
router.get("/delete/:id", userController.deleteUser);

module.exports = router;
