const db = require("../config/db");

const RouteStop = {
  // Lấy danh sách điểm dừng với tìm kiếm theo tên và/hoặc lọc theo route_id, phân trang
  getAll: (search, routeId, offset, limit, callback) => {
    let query = "SELECT SQL_CALC_FOUND_ROWS * FROM route_stops WHERE 1=1 ";
    const params = [];
    if (search) {
      query += "AND stop_name LIKE ? ";
      params.push(`%${search}%`);
    }
    if (routeId) {
      query += "AND route_id = ? ";
      params.push(routeId);
    }
    query += "ORDER BY route_id, stop_order ASC LIMIT ?, ?";
    params.push(offset, limit);
    db.query(query, params, callback);
  },

  // Lấy tổng số bản ghi (dùng cho phân trang)
  getTotalCount: (callback) => {
    db.query("SELECT FOUND_ROWS() AS total", callback);
  },

  // Lấy thông tin 1 điểm dừng theo id
  getById: (id, callback) => {
    db.query("SELECT * FROM route_stops WHERE id = ?", [id], callback);
  },

  // Tạo mới điểm dừng
  create: (data, callback) => {
    const query = `
      INSERT INTO route_stops (route_id, stop_name, stop_order, estimated_arrival_time)
      VALUES (?, ?, ?, ?)
    `;
    const { route_id, stop_name, stop_order, estimated_arrival_time } = data;
    db.query(
      query,
      [route_id, stop_name, stop_order, estimated_arrival_time],
      callback
    );
  },

  // Cập nhật điểm dừng
  update: (id, data, callback) => {
    const query = `
      UPDATE route_stops
      SET route_id = ?, stop_name = ?, stop_order = ?, estimated_arrival_time = ?
      WHERE id = ?
    `;
    const { route_id, stop_name, stop_order, estimated_arrival_time } = data;
    db.query(
      query,
      [route_id, stop_name, stop_order, estimated_arrival_time, id],
      callback
    );
  },

  // Xoá điểm dừng
  delete: (id, callback) => {
    db.query("DELETE FROM route_stops WHERE id = ?", [id], callback);
  },
};

module.exports = RouteStop;
