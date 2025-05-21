const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const driverController = require("../controllers/driverController");
const methodOverride = require("method-override");

// Use method-override middleware
router.use(methodOverride("_method"));

// Cấu hình multer: lưu file vào public/uploads với tên có timestamp
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

// Định tuyến
router.get("/", driverController.getAllDrivers);
router.get("/create", driverController.showCreateForm);
router.post("/create", upload.single("image"), driverController.createDriver);
router.get("/edit/:id", driverController.showEditForm);
router.put("/edit/:id", upload.single("avatar"), driverController.updateDriver);
router.get("/delete/:id", driverController.deleteDriver);

module.exports = router;
