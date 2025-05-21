// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// Get all bookings
router.get("/", bookingController.getAllBookings);

// Show form to add a new booking
router.get("/add", (req, res) => {
  res.render("bookings/add");
});

// Create a new booking
router.post("/", bookingController.createBooking);

// Show form to edit a booking
router.get("/:id/edit", bookingController.getBookingById);

// Update a booking
router.put("/:id", bookingController.updateBooking);

// Delete a booking
router.delete("/:id", bookingController.deleteBooking);

// Route for customer search
router.get("/customers/search", bookingController.searchCustomers);

// Show booking form
router.get("/book", bookingController.getBookingForm);

// Create a new booking
router.post("/book", bookingController.createBooking);

module.exports = router;
