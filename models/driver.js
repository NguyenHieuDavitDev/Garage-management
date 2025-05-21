const db = require("../config/db");

const Driver = {
  // Lấy danh sách tài xế với tìm kiếm gần đúng, bộ lọc theo status và phân trang
  getAll: (search, statusFilter, offset, limit, callback) => {
    let query = "SELECT SQL_CALC_FOUND_ROWS * FROM drivers WHERE 1=1 ";
    const params = [];
    if (search) {
      query +=
        "AND (first_name LIKE ? OR last_name LIKE ? OR license_number LIKE ?) ";
      const likeSearch = `%${search}%`;
      params.push(likeSearch, likeSearch, likeSearch);
    }
    if (statusFilter) {
      query += "AND status = ? ";
      params.push(statusFilter);
    }
    query += "ORDER BY id ASC LIMIT ?, ?";
    params.push(offset, limit);
    db.query(query, params, callback);
  },

  // Lấy tổng số bản ghi theo truy vấn hiện tại
  getTotalCount: (callback) => {
    db.query("SELECT FOUND_ROWS() AS total", callback);
  },

  // Lấy thông tin 1 tài xế theo id
  getById: (id, callback) => {
    const query = "SELECT * FROM drivers WHERE id = ?";
    db.query(query, [id], callback);
  },

  // Tạo mới tài xế (bao gồm avatar)
  create: (data, callback) => {
    const query = `
      INSERT INTO drivers (first_name, last_name, license_number, experience_years, date_of_birth, address, rating, status, user_id, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const {
      first_name,
      last_name,
      license_number,
      experience_years,
      date_of_birth,
      address,
      rating,
      status,
      user_id,
      avatar,
    } = data;
    db.query(
      query,
      [
        first_name,
        last_name,
        license_number,
        experience_years,
        date_of_birth,
        address,
        rating,
        status,
        user_id,
        avatar || null,
      ],
      callback
    );
  },

  // Cập nhật thông tin tài xế (bao gồm avatar)
  update: (id, data, callback) => {
    const query = `
      UPDATE drivers
      SET first_name = ?, last_name = ?, license_number = ?, experience_years = ?, date_of_birth = ?, address = ?, rating = ?, status = ?, user_id = ?, avatar = ?
      WHERE id = ?
    `;
    const {
      first_name,
      last_name,
      license_number,
      experience_years,
      date_of_birth,
      address,
      rating,
      status,
      user_id,
      avatar,
    } = data;
    db.query(
      query,
      [
        first_name,
        last_name,
        license_number,
        experience_years,
        date_of_birth,
        address,
        rating,
        status,
        user_id,
        avatar || null,
        id,
      ],
      callback
    );
  },

  // Xoá tài xế
  delete: (id, callback) => {
    const query = "DELETE FROM drivers WHERE id = ?";
    db.query(query, [id], callback);
  },
};

module.exports = Driver;
