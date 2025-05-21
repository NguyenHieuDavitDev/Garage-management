const Driver = require("../models/driver");

// Helper: promisify function chuyển đổi callback thành Promise
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

// Hiển thị danh sách tài xế
exports.getAllDrivers = async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const statusFilter = req.query.status || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 9; // Ví dụ hiển thị 9 card mỗi trang
    const offset = (page - 1) * limit;

    const drivers = await promisifyQuery(
      Driver.getAll,
      searchQuery,
      statusFilter,
      offset,
      limit
    );
    const countResult = await promisifyQuery(Driver.getTotalCount);
    const totalRows = countResult[0].total;
    const totalPages = Math.ceil(totalRows / limit);

    res.render("drivers/index", {
      drivers,
      searchQuery,
      statusFilter,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    res.status(500).send("Lỗi khi lấy danh sách tài xế");
  }
};

// Hiển thị form tạo tài xế mới
exports.showCreateForm = (req, res) => {
  res.render("drivers/create");
};

// Xử lý tạo tài xế mới
exports.createDriver = async (req, res) => {
  try {
    // Nếu có file upload cho avatar, cập nhật đường dẫn
    if (req.file) {
      req.body.avatar = "/uploads/" + req.file.filename;
    } else {
      req.body.avatar = null;
    }
    await promisifyQuery(Driver.create, req.body);
    res.redirect("/drivers");
  } catch (error) {
    console.error("Error creating driver:", error);
    res.status(500).send("Lỗi khi tạo tài xế: " + error.message);
  }
};

// Hiển thị form chỉnh sửa tài xế
exports.showEditForm = async (req, res) => {
  try {
    const results = await promisifyQuery(Driver.getById, req.params.id);
    if (results.length === 0) {
      return res.status(404).send("Không tìm thấy tài xế");
    }
    const driver = results[0];
    res.render("drivers/edit", { driver });
  } catch (error) {
    res.status(500).send("Lỗi khi lấy thông tin tài xế");
  }
};

// Xử lý cập nhật tài xế
exports.updateDriver = async (req, res) => {
  try {
    // If there's a new file uploaded, update the avatar
    if (req.file) {
      req.body.avatar = "/uploads/" + req.file.filename;
    } else {
      // If no new file, keep the existing avatar
      req.body.avatar = req.body.current_image || null;
    }

    // Validate status
    const validStatuses = ["Hoạt động", "Tạm nghỉ", "Đã nghỉ việc"];
    if (!validStatuses.includes(req.body.status)) {
      console.error("Invalid status value:", req.body.status);
      return res.status(400).send("Invalid status value");
    }

    // Log the incoming data for debugging
    console.log("Updating driver with ID:", req.params.id);
    console.log("Data being sent to the database:", req.body);

    await promisifyQuery(Driver.update, req.params.id, req.body);
    res.redirect("/drivers");
  } catch (error) {
    console.error("Error updating driver:", error);
    res.status(500).send("Lỗi khi cập nhật tài xế: " + error.message);
  }
};

// Xử lý xoá tài xế
exports.deleteDriver = async (req, res) => {
  try {
    await promisifyQuery(Driver.delete, req.params.id);
    res.redirect("/drivers");
  } catch (error) {
    res.status(500).send("Lỗi khi xoá tài xế");
  }
};
