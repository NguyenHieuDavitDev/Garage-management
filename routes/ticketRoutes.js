const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const Schedule = require("../models/schedule");

// Get all tickets with search, filter, and pagination
router.get("/", ticketController.getAllTickets);

// Display form to add a new ticket
router.get("/add", (req, res) => {
  Schedule.getAll(null, null, 0, 100, (err, schedules) => {
    if (err) {
      console.error("Error fetching schedules:", err);
      return res.status(500).send("Internal Server Error");
    }
    console.log("Schedules fetched:", schedules);
    res.render("tickets/add", { schedules });
  });
});

// Create a new ticket
router.post("/", ticketController.createTicket);

// Display form to edit a ticket
router.get("/:id/edit", ticketController.getTicketById);

// Update a ticket
router.put("/:id", ticketController.updateTicket);

// Delete a ticket
router.delete("/:id", ticketController.deleteTicket);

module.exports = router;
