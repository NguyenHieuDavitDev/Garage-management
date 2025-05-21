const db = require("../config/db");

const Ticket = {
  getAll: (search, filter, offset, limit, callback) => {
    let query = "SELECT SQL_CALC_FOUND_ROWS * FROM tickets WHERE 1=1 ";
    const params = [];
    if (search) {
      query += "AND (passenger_name LIKE ? OR seat_number LIKE ?) ";
      const likeSearch = `%${search}%`;
      params.push(likeSearch, likeSearch);
    }
    if (filter) {
      query += "AND status = ? ";
      params.push(filter);
    }
    query += "ORDER BY id ASC LIMIT ?, ?";
    params.push(offset, limit);
    db.query(query, params, callback);
  },

  getTotalCount: (callback) => {
    db.query("SELECT FOUND_ROWS() AS total", callback);
  },

  getById: (id, callback) => {
    db.query("SELECT * FROM tickets WHERE id = ?", [id], callback);
  },

  create: (data, callback) => {
    const query = `
      INSERT INTO tickets (schedule_id, seat_number, price, status, qr_code, passenger_name, passenger_phone, passenger_id_number, seat_class)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
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
    } = data;
    db.query(
      query,
      [
        schedule_id,
        seat_number,
        price,
        status,
        qr_code,
        passenger_name,
        passenger_phone,
        passenger_id_number,
        seat_class,
      ],
      callback
    );
  },

  update: (id, data, callback) => {
    const query = `
      UPDATE tickets
      SET schedule_id = ?, seat_number = ?, price = ?, status = ?, qr_code = ?, passenger_name = ?, passenger_phone = ?, passenger_id_number = ?, seat_class = ?
      WHERE id = ?
    `;
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
    } = data;
    db.query(
      query,
      [
        schedule_id,
        seat_number,
        price,
        status,
        qr_code,
        passenger_name,
        passenger_phone,
        passenger_id_number,
        seat_class,
        id,
      ],
      callback
    );
  },

  delete: (id, callback) => {
    db.query("DELETE FROM tickets WHERE id = ?", [id], callback);
  },

  getAllTickets: (callback) => {
    const query = "SELECT * FROM tickets";
    db.query(query, callback);
  },
};

module.exports = Ticket;
