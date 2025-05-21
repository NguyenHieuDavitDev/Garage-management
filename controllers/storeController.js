// controllers/storeController.js
const Schedule = require("../models/Schedule");
const Booking = require("../models/Booking");

const storeController = {
  // Hiển thị trang store (không cần đăng nhập)
  getStore: (req, res) => {
    Schedule.getAllSchedules((err, schedules) => {
      if (err) {
        return res.status(500).send("Lỗi khi lấy lịch trình: " + err.message);
      }
      res.render("store", { schedules });
    });
  },

  // Xử lý upload file
  postUpload: (req, res) => {
    const {
      schedule_id,
      seat_class,
      passenger_name,
      passenger_phone,
      passenger_id_number,
      pickup_location,
      dropoff_location,
    } = req.body;

    const bookingData = {
      customer_id: passenger_id_number, // Assuming passenger_id_number is used as customer_id
      total_amount: 0, // Placeholder, calculate based on seat_class or other criteria
      status: "pending", // Initial status
      pickup_location,
      dropoff_location,
    };

    Booking.create(bookingData, (err, result) => {
      if (err) {
        return res.status(500).send("Error saving booking: " + err.message);
      }
      res.send("Booking saved successfully!");
    });
  },
};

module.exports = storeController;
