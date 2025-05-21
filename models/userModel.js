const db = require("../config/db");

const User = {
  // Tìm kiếm user theo username (ví dụ, dùng cho đăng nhập)
  findByUsername: (username, callback) => {
    const query = `
      SELECT users.*, roles.name AS role 
      FROM users 
      JOIN roles ON users.role_id = roles.id 
      WHERE username = ?
    `;
    db.query(query, [username], callback);
  },

  // Kiểm tra xem username đã tồn tại hay chưa (có thể dùng cho đăng ký)
  findOne: (username, callback) => {
    const query = "SELECT * FROM users WHERE username = ?";
    db.query(query, [username], callback);
  },

  // Lấy danh sách users với tìm kiếm gần đúng, bộ lọc và phân trang
  getAll: (search, roleId, offset, limit, callback) => {
    let query = "SELECT SQL_CALC_FOUND_ROWS * FROM users WHERE 1=1 ";
    const params = [];
    if (search) {
      query +=
        "AND (username LIKE ? OR email LIKE ? OR full_name LIKE ? OR phone_number LIKE ?) ";
      const likeSearch = `%${search}%`;
      params.push(likeSearch, likeSearch, likeSearch, likeSearch);
    }
    if (roleId) {
      query += "AND role_id = ? ";
      params.push(roleId);
    }
    query += "ORDER BY id ASC LIMIT ?, ?";
    params.push(offset, limit);
    db.query(query, params, callback);
  },

  // Lấy tổng số bản ghi theo truy vấn
  getTotalCount: (callback) => {
    db.query("SELECT FOUND_ROWS() AS total", callback);
  },

  // Lấy thông tin user theo id
  getById: (id, callback) => {
    const query = "SELECT * FROM users WHERE id = ?";
    db.query(query, [id], callback);
  },

  // Tạo user mới
  create: (data, callback) => {
    const query = `
      INSERT INTO users (username, password, role_id, email, full_name, phone_number, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const {
      username,
      password,
      role_id,
      email = null,
      full_name = null,
      phone_number = null,
      avatar = null,
    } = data;
    db.query(
      query,
      [username, password, role_id, email, full_name, phone_number, avatar],
      callback
    );
  },

  // Cập nhật user
  update: (id, data, callback) => {
    const query = `
      UPDATE users
      SET username = ?, password = ?, role_id = ?, email = ?, full_name = ?, phone_number = ?, avatar = ?
      WHERE id = ?
    `;
    const {
      username,
      password = null,
      role_id,
      email,
      full_name,
      phone_number,
      avatar,
    } = data;

    const params = [
      username,
      role_id,
      email,
      full_name,
      phone_number,
      avatar,
      id,
    ];
    if (password) {
      params.splice(1, 0, password);
    } else {
      query = query.replace(", password = ?", "");
    }

    db.query(query, params, callback);
  },

  // Xoá user
  delete: (id, callback) => {
    const query = "DELETE FROM users WHERE id = ?";
    db.query(query, [id], callback);
  },
};

module.exports = User;
