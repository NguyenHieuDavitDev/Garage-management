const Schedule = require("../models/Schedule");

const getAllSchedules = (req, res) => {
  const { search, filter, page = 1 } = req.query;
  const limit = 10;
  const offset = (page - 1) * limit;

  Schedule.getAll(search, filter, offset, limit, (err, schedules) => {
    if (err) {
      return res.status(500).send(err);
    }
    Schedule.getTotalCount((err, totalCount) => {
      if (err) {
        return res.status(500).send(err);
      }
      const totalPages = Math.ceil(totalCount[0].total / limit);
      res.render("schedules/index", {
        schedules,
        search,
        filter,
        currentPage: parseInt(page),
        totalPages,
      });
    });
  });
};

const getScheduleById = (req, res) => {
  const scheduleId = req.params.id;
  Schedule.getById(scheduleId, (err, schedule) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!schedule.length) {
      return res.status(404).send("Không tìm thấy lịch trình");
    }
    res.render("schedules/edit", { schedule: schedule[0] });
  });
};

const createSchedule = (req, res) => {
  const {
    route_id,
    bus_id,
    departure_time,
    arrival_time,
    estimated_duration,
    status,
  } = req.body;
  if (
    !route_id ||
    !bus_id ||
    !departure_time ||
    !arrival_time ||
    !estimated_duration ||
    !status
  ) {
    return res.status(400).send("Dữ liệu đầu vào không hợp lệ.");
  }
  const scheduleData = {
    route_id,
    bus_id,
    departure_time,
    arrival_time,
    estimated_duration,
    status,
  };

  Schedule.create(scheduleData, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect("/schedules");
  });
};

const updateSchedule = (req, res) => {
  const scheduleId = req.params.id;
  const {
    route_id,
    bus_id,
    departure_time,
    arrival_time,
    estimated_duration,
    status,
  } = req.body;
  if (
    !route_id ||
    !bus_id ||
    !departure_time ||
    !arrival_time ||
    !estimated_duration ||
    !status
  ) {
    return res.status(400).send("Dữ liệu đầu vào không hợp lệ.");
  }
  const scheduleData = {
    route_id,
    bus_id,
    departure_time,
    arrival_time,
    estimated_duration,
    status,
  };

  Schedule.update(scheduleId, scheduleData, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect("/schedules");
  });
};

const deleteSchedule = (req, res) => {
  const scheduleId = req.params.id;
  Schedule.delete(scheduleId, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect("/schedules");
  });
};

module.exports = {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
