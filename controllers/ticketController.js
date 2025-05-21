const Ticket = require("../models/Ticket");

const getAllTickets = (req, res) => {
  const { search, filter, page = 1 } = req.query;
  const limit = 10;
  const offset = (page - 1) * limit;

  Ticket.getAll(search, filter, offset, limit, (err, tickets) => {
    if (err) {
      return res.status(500).send(err);
    }
    Ticket.getTotalCount((err, totalCount) => {
      if (err) {
        return res.status(500).send(err);
      }
      const totalPages = Math.ceil(totalCount[0].total / limit);
      res.render("tickets/index", {
        tickets,
        search,
        filter,
        currentPage: parseInt(page),
        totalPages,
      });
    });
  });
};

const getTicketById = (req, res) => {
  const ticketId = req.params.id;
  Ticket.getById(ticketId, (err, ticket) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!ticket.length) {
      return res.status(404).send("Không tìm thấy vé");
    }
    res.render("tickets/edit", { ticket: ticket[0] });
  });
};

const createTicket = (req, res) => {
  const {
    schedule_id,
    seat_number,
    price,
    status,
    qr_code,
    passenger_name,
    passenger_phone,
    passenger_id_number,
    seat_class,
  } = req.body;
  if (
    !schedule_id ||
    !seat_number ||
    !price ||
    !status ||
    !passenger_name ||
    !passenger_phone ||
    !seat_class
  ) {
    return res.status(400).send("Dữ liệu đầu vào không hợp lệ.");
  }
  const ticketData = {
    schedule_id,
    seat_number,
    price,
    status,
    qr_code,
    passenger_name,
    passenger_phone,
    passenger_id_number,
    seat_class,
  };

  Ticket.create(ticketData, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect("/tickets");
  });
};

const updateTicket = (req, res) => {
  const ticketId = req.params.id;
  const {
    schedule_id,
    seat_number,
    price,
    status,
    qr_code,
    passenger_name,
    passenger_phone,
    passenger_id_number,
    seat_class,
  } = req.body;
  if (
    !schedule_id ||
    !seat_number ||
    !price ||
    !status ||
    !passenger_name ||
    !passenger_phone ||
    !seat_class
  ) {
    return res.status(400).send("Dữ liệu đầu vào không hợp lệ.");
  }
  const ticketData = {
    schedule_id,
    seat_number,
    price,
    status,
    qr_code,
    passenger_name,
    passenger_phone,
    passenger_id_number,
    seat_class,
  };

  Ticket.update(ticketId, ticketData, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect("/tickets");
  });
};

const deleteTicket = (req, res) => {
  const ticketId = req.params.id;
  Ticket.delete(ticketId, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect("/tickets");
  });
};

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
};
