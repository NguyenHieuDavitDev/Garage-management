// models/bus.js

const db = require("../config/db");

const Bus = {
  // Lấy danh sách xe với phân trang, tìm kiếm theo biển số và lọc theo bus_type (nếu cần)
  getAll: (search = "", busType = "", offset, limit, callback) => {
    let query = "SELECT SQL_CALC_FOUND_ROWS * FROM buses WHERE 1=1 ";
    let params = [];
    if (search) {
      query += "AND license_plate LIKE ? ";
      params.push(`%${search}%`);
    }
    if (busType) {
      query += "AND bus_type = ? ";
      params.push(busType);
    }
    query += "ORDER BY id ASC LIMIT ?, ?";
    params.push(offset, limit);
    db.query(query, params, callback);
  },

  // Lấy tổng số bản ghi thỏa mãn truy vấn hiện tại (dùng cho phân trang)
  getTotalCount: (callback) => {
    db.query("SELECT FOUND_ROWS() AS total", callback);
  },

  // Lấy thông tin 1 xe theo id
  getById: (id, callback) => {
    db.query("SELECT * FROM buses WHERE id = ?", [id], callback);
  },

  // Tạo mới bản ghi xe
  create: (data, callback) => {
    const query = `
      INSERT INTO buses 
        (license_plate, bus_type, capacity, brand, manufacture_year, status, driver_id, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      query,
      [
        data.license_plate,
        data.bus_type,
        data.capacity,
        data.brand,
        data.manufacture_year,
        data.status, // Nếu không truyền giá trị status, mặc định sẽ là 'Hoạt động'
        data.driver_id,
        data.image || null, // Xử lý image nếu được upload
      ],
      callback
    );
  },

  // Cập nhật thông tin xe theo id
  update: (id, data, callback) => {
    const query = `
      UPDATE buses
      SET license_plate = ?, bus_type = ?, capacity = ?, brand = ?, manufacture_year = ?, status = ?, driver_id = ?, image = ?
      WHERE id = ?
    `;
    db.query(
      query,
      [
        data.license_plate,
        data.bus_type,
        data.capacity,
        data.brand,
        data.manufacture_year,
        data.status,
        data.driver_id,
        data.image || null,
        id,
      ],
      callback
    );
  },

  // Xoá xe theo id
  delete: (id, callback) => {
    db.query("DELETE FROM buses WHERE id = ?", [id], callback);
  },
};

module.exports = Bus;
