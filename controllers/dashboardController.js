const db = require("../config/db");
const Booking = require("../models/Booking");
const Schedule = require("../models/Schedule");
const Ticket = require("../models/Ticket");

const getChartData = (req, res) => {
  // Fetch data from the database
  Booking.getAllBookings((err, bookings) => {
    if (err) {
      return res.status(500).send(err);
    }

    Schedule.getAllSchedules((err, schedules) => {
      if (err) {
        return res.status(500).send(err);
      }

      Ticket.getAllTickets((err, tickets) => {
        if (err) {
          return res.status(500).send(err);
        }

        // Process and format the data for the charts
        const data = {
          labels: ["Bookings", "Schedules", "Tickets"],
          barData: [bookings.length, schedules.length, tickets.length],
          lineData: [bookings.length, schedules.length, tickets.length], // Example data
          pieData: [bookings.length, schedules.length, tickets.length], // Example data
        };

        res.json(data);
      });
    });
  });
};

module.exports = {
  getChartData,
};
