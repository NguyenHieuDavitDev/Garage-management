// controllers/routeController.js
const Route = require("../models/Route");

const getAllRoutes = (req, res) => {
  const { search, page = 1 } = req.query;
  const limit = 10;
  const offset = (page - 1) * limit;

  Route.getAll(search, offset, limit, (err, routes) => {
    if (err) {
      return res.status(500).send(err);
    }
    Route.getTotalCount((err, totalCount) => {
      if (err) {
        return res.status(500).send(err);
      }
      const totalPages = Math.ceil(totalCount[0].total / limit);
      res.render("routes/index", {
        routes,
        search,
        currentPage: parseInt(page),
        totalPages,
      });
    });
  });
};

const getRouteById = (req, res) => {
  const routeId = req.params.id;
  Route.getById(routeId, (err, route) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!route.length) {
      return res.status(404).send("Không tìm thấy tuyến đường");
    }
    res.render("routes/edit", { route: route[0] });
  });
};

const createRoute = (req, res) => {
  const {
    route_name,
    start_location,
    end_location,
    distance_km,
    expected_duration,
    ticket_price,
  } = req.body;
  if (
    !route_name ||
    !start_location ||
    !end_location ||
    !distance_km ||
    !expected_duration ||
    !ticket_price
  ) {
    return res.status(400).send("Dữ liệu đầu vào không hợp lệ.");
  }
  const routeData = {
    route_name,
    start_location,
    end_location,
    distance_km,
    expected_duration,
    ticket_price,
  };

  Route.create(routeData, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect("/routes");
  });
};

const updateRoute = (req, res) => {
  const routeId = req.params.id;
  const {
    route_name,
    start_location,
    end_location,
    distance_km,
    expected_duration,
    ticket_price,
  } = req.body;
  if (
    !route_name ||
    !start_location ||
    !end_location ||
    !distance_km ||
    !expected_duration ||
    !ticket_price
  ) {
    return res.status(400).send("Dữ liệu đầu vào không hợp lệ.");
  }
  const routeData = {
    route_name,
    start_location,
    end_location,
    distance_km,
    expected_duration,
    ticket_price,
  };

  Route.update(routeId, routeData, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect("/routes");
  });
};

const deleteRoute = (req, res) => {
  const routeId = req.params.id;
  Route.delete(routeId, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect("/routes");
  });
};

module.exports = {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
};
