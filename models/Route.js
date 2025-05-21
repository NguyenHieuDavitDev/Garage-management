// models/route.js
const db = require("../config/db");

const Route = {
  // Lấy danh sách tuyến đường với tìm kiếm gần đúng và phân trang
  getAll: (search, offset, limit, callback) => {
    let query = "SELECT SQL_CALC_FOUND_ROWS * FROM routes WHERE 1=1 ";
    const params = [];
    if (search) {
      query +=
        "AND (route_name LIKE ? OR start_location LIKE ? OR end_location LIKE ?) ";
      const likeSearch = `%${search}%`;
      params.push(likeSearch, likeSearch, likeSearch);
    }
    query += "ORDER BY id ASC LIMIT ?, ?";
    params.push(offset, limit);
    db.query(query, params, callback);
  },

  // Lấy tổng số bản ghi dựa trên truy vấn hiện tại
  getTotalCount: (callback) => {
    db.query("SELECT FOUND_ROWS() AS total", callback);
  },

  // Lấy thông tin 1 tuyến đường theo id
  getById: (id, callback) => {
    db.query("SELECT * FROM routes WHERE id = ?", [id], callback);
  },

  // Tạo mới tuyến đường
  create: (data, callback) => {
    const query = `
      INSERT INTO routes (route_name, start_location, end_location, distance_km, expected_duration, ticket_price)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const {
      route_name,
      start_location,
      end_location,
      distance_km,
      expected_duration,
      ticket_price,
    } = data;
    db.query(
      query,
      [
        route_name,
        start_location,
        end_location,
        distance_km,
        expected_duration,
        ticket_price,
      ],
      callback
    );
  },

  // Cập nhật tuyến đường
  update: (id, data, callback) => {
    const query = `
      UPDATE routes
      SET route_name = ?, start_location = ?, end_location = ?, distance_km = ?, expected_duration = ?, ticket_price = ?
      WHERE id = ?
    `;
    const {
      route_name,
      start_location,
      end_location,
      distance_km,
      expected_duration,
      ticket_price,
    } = data;
    db.query(
      query,
      [
        route_name,
        start_location,
        end_location,
        distance_km,
        expected_duration,
        ticket_price,
        id,
      ],
      callback
    );
  },

  // Xoá tuyến đường
  delete: (id, callback) => {
    db.query("DELETE FROM routes WHERE id = ?", [id], callback);
  },
};

module.exports = Route;
