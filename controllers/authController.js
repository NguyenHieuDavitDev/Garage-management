const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const authController = {
  // Hiển thị trang đăng nhập
  getLogin: (req, res) => {
    res.render("login", { error: null });
  },

  // Xử lý đăng nhập
  postLogin: (req, res) => {
    const { username, password } = req.body;
    User.findByUsername(username, async (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          req.session.user = {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            role: user.role,
          };
          // Nếu là admin chuyển đến dashboard, còn không chuyển về store
          if (user.role === "admin") {
            return res.redirect("/dashboard");
          } else {
            return res.redirect("/store");
          }
        } else {
          return res.render("login", { error: "Sai thông tin đăng nhập" });
        }
      } else {
        return res.render("login", { error: "Không tìm thấy người dùng" });
      }
    });
  },

  // trang đăng ký
  getRegister: (req, res) => {
    res.render("register", { error: null });
  },

  // Xử lý đăng ký
  postRegister: async (req, res) => {
    const { username, password, role_id } = req.body;

    // Check if username already exists
    User.findOne(username, async (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        return res.render("register", { error: "Username đã tồn tại." });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        User.create(
          { username, password: hashedPassword, role_id },
          (err, results) => {
            if (err) throw err;
            res.redirect("/auth/login");
          }
        );
      }
    });
  },

  // Xử lý logout
  logout: (req, res) => {
    req.session.destroy();
    res.redirect("/auth/login");
  },
};

module.exports = authController;
