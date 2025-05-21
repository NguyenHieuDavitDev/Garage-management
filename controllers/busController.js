// controllers/busController.js

const Bus = require("../models/bus");
const db = require("../config/db");

// Helper: promisify function chuyển callback thành Promise
const promisifyQuery = (fn, ...args) => {
  return new Promise((resolve, reject) => {
    fn(...args, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Hiển thị danh sách xe
exports.getAllBuses = async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const busTypeFilter = req.query.bus_type || "";
    const statusFilter = req.query.status || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 9; // Hiển thị 9 bản ghi mỗi trang (có thể tuỳ chỉnh)
    const offset = (page - 1) * limit;

    const buses = await promisifyQuery(
      Bus.getAll,
      searchQuery,
      busTypeFilter,
      offset,
      limit
    );
    const countResult = await promisifyQuery(Bus.getTotalCount);
    const totalRows = countResult[0].total;
    const totalPages = Math.ceil(totalRows / limit);

    res.render("buses/index", {
      buses,
      search: searchQuery,
      busTypeFilter,
      status: statusFilter,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("Error getting buses:", error);
    res.status(500).send("Lỗi khi lấy danh sách xe");
  }
};

// Hiển thị form tạo xe mới
exports.showCreateForm = (req, res) => {
  res.render("buses/create");
};

// Xử lý tạo xe mới
exports.createBus = async (req, res) => {
  try {
    // Nếu có file upload cho image, cập nhật đường dẫn lưu vào trường image
    if (req.file) {
      req.body.image = "/uploads/" + req.file.filename;
    } else {
      req.body.image = null;
    }
    await promisifyQuery(Bus.create, req.body);
    res.redirect("/buses");
  } catch (error) {
    console.error("Error creating bus:", error);
    res.status(500).send("Lỗi khi tạo xe: " + error.message);
  }
};

// Hiển thị form chỉnh sửa thông tin xe
exports.showEditForm = async (req, res) => {
  try {
    const results = await promisifyQuery(Bus.getById, req.params.id);
    if (results.length === 0) {
      return res.status(404).send("Không tìm thấy xe");
    }
    const bus = results[0];
    res.render("buses/edit", { bus });
  } catch (error) {
    console.error("Error fetching bus:", error);
    res.status(500).send("Lỗi khi lấy thông tin xe");
  }
};

// Xử lý cập nhật thông tin xe
exports.updateBus = async (req, res) => {
  try {
    // Nếu có file upload mới cho image, cập nhật lại trường image
    if (req.file) {
      req.body.image = "/uploads/" + req.file.filename;
    } else {
      req.body.image = req.body.current_image || null;
    }
    await promisifyQuery(Bus.update, req.params.id, req.body);
    res.redirect("/buses");
  } catch (error) {
    console.error("Error updating bus:", error);
    res.status(500).send("Lỗi khi cập nhật xe: " + error.message);
  }
};

// Xử lý xoá xe
exports.deleteBus = async (req, res) => {
  try {
    await promisifyQuery(Bus.delete, req.params.id);
    res.redirect("/buses");
  } catch (error) {
    console.error("Error deleting bus:", error);
    res.status(500).send("Lỗi khi xoá xe");
  }
};
