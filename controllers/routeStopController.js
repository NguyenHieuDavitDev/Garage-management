const RouteStop = require("../models/routeStop");

// Lấy danh sách điểm dừng, hỗ trợ tìm kiếm và phân trang
const getAllRouteStops = (req, res) => {
  const { search, route_id, page = 1 } = req.query;
  const limit = 10;
  const offset = (page - 1) * limit;

  RouteStop.getAll(search, route_id, offset, limit, (err, stops) => {
    if (err) return res.status(500).send(err);
    RouteStop.getTotalCount((err, countResult) => {
      if (err) return res.status(500).send(err);
      const totalPages = Math.ceil(countResult[0].total / limit);
      res.render("routeStops/index", {
        stops,
        search,
        route_id,
        currentPage: parseInt(page),
        totalPages,
      });
    });
  });
};

// Lấy thông tin chi tiết 1 điểm dừng theo id
const getRouteStopById = (req, res) => {
  const stopId = req.params.id;
  RouteStop.getById(stopId, (err, stop) => {
    if (err) return res.status(500).send(err);
    if (!stop.length) return res.status(404).send("Không tìm thấy điểm dừng");
    res.render("routeStops/edit", { stop: stop[0] });
  });
};

// Tạo mới điểm dừng
const createRouteStop = (req, res) => {
  const { route_id, stop_name, stop_order, estimated_arrival_time } = req.body;
  if (!route_id || !stop_name || !stop_order || !estimated_arrival_time) {
    return res.status(400).send("Dữ liệu đầu vào không hợp lệ.");
  }
  const data = { route_id, stop_name, stop_order, estimated_arrival_time };
  RouteStop.create(data, (err) => {
    if (err) return res.status(500).send(err);
    res.redirect("/route-stops");
  });
};

// Cập nhật điểm dừng
const updateRouteStop = (req, res) => {
  const stopId = req.params.id;
  const { route_id, stop_name, stop_order, estimated_arrival_time } = req.body;
  if (!route_id || !stop_name || !stop_order || !estimated_arrival_time) {
    return res.status(400).send("Dữ liệu đầu vào không hợp lệ.");
  }
  const data = { route_id, stop_name, stop_order, estimated_arrival_time };
  RouteStop.update(stopId, data, (err) => {
    if (err) return res.status(500).send(err);
    res.redirect("/route-stops");
  });
};

// Xoá điểm dừng
const deleteRouteStop = (req, res) => {
  const stopId = req.params.id;
  RouteStop.delete(stopId, (err) => {
    if (err) return res.status(500).send(err);
    res.redirect("/route-stops");
  });
};

module.exports = {
  getAllRouteStops,
  getRouteStopById,
  createRouteStop,
  updateRouteStop,
  deleteRouteStop,
};
