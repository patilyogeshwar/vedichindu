const express = require("express");
const {
  createShift,
  getAllShift,
  getSingleShift,
  getSingleComShift,
  updateSingleShift,
  deleteSingleShift,
} = require("./shift.controller");
const authorize = require("../../../utils/authorize"); // authentication middleware

const shiftRoutes = express.Router();

shiftRoutes.post("/", authorize("create-shift"), createShift);
shiftRoutes.get("/", authorize("readAll-shift"), getAllShift);
shiftRoutes.get("/:id", authorize("readSingle-shift"), getSingleShift);
shiftRoutes.get("/shiftcategory/:id", authorize("readSingle-shift"), getSingleComShift);
shiftRoutes.put("/:id", authorize("update-shift"), updateSingleShift);
shiftRoutes.delete("/:id", authorize("delete-shift"), deleteSingleShift);
module.exports = shiftRoutes;
