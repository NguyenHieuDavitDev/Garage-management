// routes/routeRoutes.js
const express = require("express");
const router = express.Router();
const routeController = require("../controllers/routeController");

// Lấy danh sách tuyến đường
router.get("/", routeController.getAllRoutes);

// Hiển thị form thêm tuyến đường
router.get("/add", (req, res) => {
  res.render("routes/add");
});

// Tạo mới tuyến đường
router.post("/", routeController.createRoute);

// Hiển thị form chỉnh sửa tuyến đường
router.get("/:id/edit", routeController.getRouteById);

// Cập nhật tuyến đường
router.put("/:id", routeController.updateRoute);

// Xoá tuyến đường
router.delete("/:id", routeController.deleteRoute);

module.exports = router;
