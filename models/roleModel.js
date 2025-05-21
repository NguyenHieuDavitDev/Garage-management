const db = require("../config/db");

const Role = {
  // Lấy thông tin role theo id
  findById: (id, callback) => {
    db.query("SELECT * FROM roles WHERE id = ?", [id], callback);
  },
};

module.exports = Role;
