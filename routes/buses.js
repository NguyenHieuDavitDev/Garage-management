// routes/buses.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const busController = require("../controllers/busController");
const methodOverride = require("method-override");

// Sử dụng method-override để hỗ trợ PUT và DELETE
router.use(methodOverride("_method"));

// Cấu hình multer: Lưu file vào thư mục public/uploads với tên có timestamp
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});
const upload = multer({ storage });

// Các route định nghĩa cho CRUD xe

// Lấy danh sách xe (GET /buses)
router.get("/", busController.getAllBuses);

// Form tạo mới xe (GET /buses/add)
router.get("/add", busController.showCreateForm);

// Xử lý tạo xe mới (POST /buses/create)
router.post("/create", upload.single("image"), busController.createBus);

// Form chỉnh sửa thông tin xe (GET /buses/edit/:id)
router.get("/edit/:id", busController.showEditForm);

// Xử lý cập nhật thông tin xe (PUT /buses/edit/:id)
router.put("/edit/:id", upload.single("image"), busController.updateBus);

// Xoá xe (GET hoặc DELETE, tùy cách triển khai)
router.get("/delete/:id", busController.deleteBus);

// Route to show the edit bus form
router.get("/:id/edit", busController.showEditForm);

// Handle updating a bus (PUT /buses/:id)
router.put("/:id", upload.single("image"), busController.updateBus);

// Handle deleting a bus (DELETE /buses/:id)
router.delete("/:id", busController.deleteBus);

module.exports = router;
