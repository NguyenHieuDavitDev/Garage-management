// models/Booking.js
const db = require("../config/db");

const Booking = {
  // lấy tất cả các đặt vé với các bộ lọc
  getAll: (search, statusFilter, offset, limit, callback) => {
    let query = "SELECT SQL_CALC_FOUND_ROWS * FROM bookings WHERE 1=1 ";
    const params = [];
    if (search) {
      query += "AND (pickup_location LIKE ? OR dropoff_location LIKE ?) ";
      const likeSearch = `%${search}%`;
      params.push(likeSearch, likeSearch);
    }
    if (statusFilter) {
      query += "AND status = ? ";
      params.push(statusFilter);
    }
    query += "ORDER BY booking_date DESC LIMIT ?, ?";
    params.push(offset, limit);
    db.query(query, params, callback);
  },

  // lay tổng số lượng đặt vé
  getTotalCount: (callback) => {
    db.query("SELECT FOUND_ROWS() AS total", callback);
  },

  // lấy thông tin đặt vé theo id
  getById: (id, callback) => {
    db.query("SELECT * FROM bookings WHERE id = ?", [id], callback);
  },

  // tạo mới một đặt vé
  create: (data, callback) => {
    const query = `
      INSERT INTO bookings (customer_id, total_amount, status, pickup_location, dropoff_location)
      VALUES (?, ?, ?, ?, ?)
    `;
    const {
      customer_id,
      total_amount,
      status,
      pickup_location,
      dropoff_location,
    } = data;
    db.query(
      query,
      [customer_id, total_amount, status, pickup_location, dropoff_location],
      callback
    );
  },

  // chỉnh sửa thông tin đặt vé
  update: (id, data, callback) => {
    const query = `
      UPDATE bookings
      SET customer_id = ?, total_amount = ?, status = ?, pickup_location = ?, dropoff_location = ?
      WHERE id = ?
    `;
    const {
      customer_id,
      total_amount,
      status,
      pickup_location,
      dropoff_location,
    } = data;
    db.query(
      query,
      [
        customer_id,
        total_amount,
        status,
        pickup_location,
        dropoff_location,
        id,
      ],
      callback
    );
  },

  // xoá một đặt vé
  delete: (id, callback) => {
    db.query("DELETE FROM bookings WHERE id = ?", [id], callback);
  },

  // tìm kiếm khách hàng theo tên hoặc id
  searchCustomers: (term, callback) => {
    const query =
      "SELECT id, name FROM customers WHERE name LIKE ? OR id LIKE ?";
    const likeTerm = `%${term}%`;
    db.query(query, [likeTerm, likeTerm], callback);
  },

  // lấy tất cả các đặt vé
  getAllBookings: (callback) => {
    const query = "SELECT * FROM bookings";
    db.query(query, callback);
  },
};

module.exports = Booking;
