// controllers/bookingController.js
const Booking = require("../models/Booking");
const Schedule = require("../models/Schedule");

const getAllBookings = (req, res) => {
  const { search, status, page = 1 } = req.query; // lấy các tham số từ query string
  const limit = 10;
  const offset = (page - 1) * limit;

  Booking.getAll(search, status, offset, limit, (err, bookings) => {
    if (err) {
      return res.status(500).send(err);
    }
    Booking.getTotalCount((err, totalCount) => {
      if (err) {
        return res.status(500).send(err);
      }
      const totalPages = Math.ceil(totalCount[0].total / limit);
      res.render("bookings/index", {
        bookings,
        search,
        status,
        currentPage: parseInt(page),
        totalPages,
      });
    });
  });
};

const getBookingById = (req, res) => {
  const bookingId = req.params.id;
  Booking.getById(bookingId, (err, booking) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!booking.length) {
      return res.status(404).send("Không tìm thấy đặt vé");
    }
    res.render("bookings/edit", { booking: booking[0] });
  });
};

const getBookingForm = (req, res) => {
  // lấy lịch trình từ cơ sở dữ liệu
  Schedule.getAllSchedules((err, schedules) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.render("bookings/form", { schedules });
  });
};

const createBooking = (req, res) => {
  const {
    customer_id,
    total_amount,
    status,
    pickup_location,
    dropoff_location,
  } = req.body;
  const bookingData = {
    customer_id,
    total_amount,
    status,
    pickup_location,
    dropoff_location,
  };

  Booking.create(bookingData, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect("/bookings");
  });
};

const updateBooking = (req, res) => {
  const bookingId = req.params.id;
  const {
    customer_id,
    total_amount,
    status,
    pickup_location,
    dropoff_location,
  } = req.body;
  if (
    !customer_id ||
    !total_amount ||
    !status ||
    !pickup_location ||
    !dropoff_location
  ) {
    return res.status(400).send("Dữ liệu đầu vào không hợp lệ.");
  }
  const bookingData = {
    customer_id,
    total_amount,
    status,
    pickup_location,
    dropoff_location,
  };

  Booking.update(bookingId, bookingData, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect("/bookings");
  });
};

const deleteBooking = (req, res) => {
  const bookingId = req.params.id;
  Booking.delete(bookingId, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect("/bookings");
  });
};

const searchCustomers = (req, res) => {
  const term = req.query.term;
  Booking.searchCustomers(term, (err, customers) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(
      customers.map((customer) => ({
        id: customer.id,
        label: `${customer.id} - ${customer.name}`,
        value: customer.id,
      }))
    );
  });
};

module.exports = {
  getAllBookings,
  getBookingById,
  getBookingForm,
  createBooking,
  updateBooking,
  deleteBooking,
  searchCustomers,
};
