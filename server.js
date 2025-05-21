const express = require("express");
const path = require("path");
const session = require("express-session");
const methodOverride = require("method-override");
const scheduleRoutes = require("./routes/scheduleRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const busRoutes = require("./routes/buses");

const app = express();

// Cấu hình view engine EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method")); // Dùng cho PUT, DELETE
app.use(express.static(path.join(__dirname, "public")));

// Cấu hình session
app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
  })
);

const authRoutes = require("./routes/auth");
const storeRoutes = require("./routes/store");
const usersRoutes = require("./routes/users");
const driversRoutes = require("./routes/drivers");
const routeRoutes = require("./routes/routeRoutes");
const routeStopRoutes = require("./routes/routeStopRoutes");

// Kiểm tra quyền truy cập của user
function checkAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") {
    return next();
  } else {
    res.redirect("/auth/login");
  }
}
app.use("/auth", authRoutes);
app.use("/store", storeRoutes);
app.use("/users", usersRoutes);
app.use("/drivers", driversRoutes);
app.use("/buses", busRoutes);
app.use("/routes", routeRoutes);
app.use("/route-stops", routeStopRoutes);
app.use("/schedules", scheduleRoutes);
app.use("/tickets", ticketRoutes);
const bookingRoutes = require("./routes/bookingRoutes");
app.use("/bookings", bookingRoutes);
app.use("/dashboard", dashboardRoutes);

// Route dashboard cho admin (yêu cầu đăng nhập và quyền admin)
app.get("/dashboard", checkAdmin, (req, res) => {
  console.log("User object:", req.session.user);
  res.render("dashboard", { user: req.session.user });
});

// Route "/" chuyển về trang store (không cần đăng nhập)
app.get("/", (req, res) => {
  res.redirect("/store");
});

// Route logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Không thể đăng xuất");
    }
    res.redirect("/auth/login");
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
