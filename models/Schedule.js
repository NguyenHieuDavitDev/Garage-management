const db = require("../config/db");

const Schedule = {
  getAll: (search, filter, offset, limit, callback) => {
    let query = "SELECT SQL_CALC_FOUND_ROWS * FROM schedules WHERE 1=1 ";
    const params = [];
    if (search) {
      query += "AND (route_id LIKE ? OR bus_id LIKE ?) ";
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
    db.query("SELECT * FROM schedules WHERE id = ?", [id], callback);
  },

  create: (data, callback) => {
    const query = `
      INSERT INTO schedules (route_id, bus_id, departure_time, arrival_time, estimated_duration, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const {
      route_id,
      bus_id,
      departure_time,
      arrival_time,
      estimated_duration,
      status,
    } = data;
    db.query(
      query,
      [
        route_id,
        bus_id,
        departure_time,
        arrival_time,
        estimated_duration,
        status,
      ],
      callback
    );
  },

  update: (id, data, callback) => {
    const query = `
      UPDATE schedules
      SET route_id = ?, bus_id = ?, departure_time = ?, arrival_time = ?, estimated_duration = ?, status = ?
      WHERE id = ?
    `;
    const {
      route_id,
      bus_id,
      departure_time,
      arrival_time,
      estimated_duration,
      status,
    } = data;
    db.query(
      query,
      [
        route_id,
        bus_id,
        departure_time,
        arrival_time,
        estimated_duration,
        status,
        id,
      ],
      callback
    );
  },

  delete: (id, callback) => {
    db.query("DELETE FROM schedules WHERE id = ?", [id], callback);
  },

  getAllSchedules: (callback) => {
    const query = "SELECT * FROM schedules";
    db.query(query, callback);
  },
};

module.exports = Schedule;
