const User = require("../models/userModel");
const bcrypt = require("bcrypt");

// Helper: promisify function để chuyển callback thành Promise
const promisifyQuery = (fn, ...args) => {
  return new Promise((resolve, reject) => {
    fn(...args, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Hiển thị danh sách users (với tìm kiếm, bộ lọc và phân trang)
exports.getAllUsers = async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const roleFilter = req.query.role || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const users = await promisifyQuery(
      User.getAll,
      searchQuery,
      roleFilter,
      offset,
      limit
    );
    const countResult = await promisifyQuery(User.getTotalCount);
    const totalRows = countResult[0].total;
    const totalPages = Math.ceil(totalRows / limit);

    res.render("users/index", {
      users,
      searchQuery,
      roleFilter,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    res.status(500).send("Lỗi khi lấy danh sách tài khoản");
  }
};

// Hiển thị form tạo user mới
exports.showCreateForm = (req, res) => {
  res.render("users/create");
};

// Xử lý tạo user mới
exports.createUser = async (req, res) => {
  try {
    // Nếu có file được upload, gán đường dẫn file
    if (req.file) {
      req.body.avatar = "/uploads/" + req.file.filename;
    } else {
      req.body.avatar = "";
    }
    // (Ở đây nên băm password bằng bcrypt trước khi lưu)
    await promisifyQuery(User.create, req.body);
    res.redirect("/users");
  } catch (error) {
    res.status(500).send("Lỗi khi tạo tài khoản");
  }
};

// Hiển thị form chỉnh sửa user
exports.showEditForm = async (req, res) => {
  try {
    const results = await promisifyQuery(User.getById, req.params.id);
    if (results.length === 0)
      return res.status(404).send("Không tìm thấy tài khoản");
    const user = results[0];
    res.render("users/edit", { user });
  } catch (error) {
    res.status(500).send("Lỗi khi lấy thông tin tài khoản");
  }
};

// Xử lý cập nhật user
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const existingUser = await promisifyQuery(User.getById, userId);

    if (existingUser.length === 0) {
      return res.status(404).send("Không tìm thấy tài khoản");
    }

    const userData = req.body;

    // If a new avatar is uploaded, use it; otherwise, keep the existing one
    if (req.file) {
      userData.avatar = "/uploads/" + req.file.filename;
    } else {
      userData.avatar = existingUser[0].avatar; // Retain existing avatar
    }

    // Check if a new password is provided
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10); // Hash the new password
    }

    await promisifyQuery(User.update, userId, userData);
    res.redirect("/users");
  } catch (error) {
    res.status(500).send("Lỗi khi cập nhật tài khoản");
  }
};

// Xử lý xoá user
exports.deleteUser = async (req, res) => {
  try {
    await promisifyQuery(User.delete, req.params.id);
    res.redirect("/users");
  } catch (error) {
    res.status(500).send("Lỗi khi xoá tài khoản");
  }
};
