const express = require("express");
const router = express.Router();
const routeStopController = require("../controllers/routeStopController");

// Lấy danh sách điểm dừng (có hỗ trợ tìm kiếm, phân trang)
router.get("/", routeStopController.getAllRouteStops);

// Hiển thị form thêm điểm dừng mới
router.get("/add", (req, res) => {
  res.render("routeStops/add");
});

// Tạo mới điểm dừng
router.post("/", routeStopController.createRouteStop);

// Hiển thị form chỉnh sửa điểm dừng
router.get("/:id/edit", routeStopController.getRouteStopById);

// Cập nhật điểm dừng
router.put("/:id", routeStopController.updateRouteStop);

// Xoá điểm dừng
router.delete("/:id", routeStopController.deleteRouteStop);

module.exports = router;
