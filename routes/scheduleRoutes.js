const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");

// Lấy danh sách lịch trình
router.get("/", scheduleController.getAllSchedules);

// Hiển thị form thêm lịch trình
router.get("/add", (req, res) => {
  res.render("schedules/add");
});

// Tạo mới lịch trình
router.post("/", scheduleController.createSchedule);

// Hiển thị form chỉnh sửa lịch trình
router.get("/:id/edit", scheduleController.getScheduleById);

// Cập nhật lịch trình
router.put("/:id", scheduleController.updateSchedule);

// Xoá lịch trình
router.delete("/:id", scheduleController.deleteSchedule);

module.exports = router;
