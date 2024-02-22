const express = require("express");
const companyRoutes = express.Router();
const multer = require("multer");
const {
  createCompany,
  getAllCompany,
  getAllCompanyApi,
  getSingleCompany,
  updateCompany,
  deleteCompany,
} = require("./company.controller");
const authorize = require("../../../utils/authorize"); // authentication middleware


// generate random file name for extra security on naming
const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

// store files upload folder in disk
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "routes/files/uploads/");
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    if (
      extension !== ".jpg" &&
      extension !== ".jpeg" &&
      extension !== ".png" &&
      extension !== ".pdf"
    ) {
      return cb(new Error("Only images and pdf are allowed"));
    } else if (extension === ".pdf") {
      const uniqueSuffix = generateFileName();
      cb(null, uniqueSuffix + ".pdf");
    } else if (extension === ".png") {
      const uniqueSuffix = generateFileName();
      cb(null, uniqueSuffix + ".png");
    } else {
      const uniqueSuffix = generateFileName();
      cb(null, uniqueSuffix + ".jpg");
    }
  },
});
// multer middleware
const upload = multer({ storage: storage });


companyRoutes.post("/", upload.array("files", 1), authorize("create-company"), createCompany);
companyRoutes.get("/", authorize("readAll-company"), getAllCompany);
companyRoutes.get("/:id", authorize("readSingle-company"), getSingleCompany);
companyRoutes.put("/:id", authorize("update-company"), updateCompany);
companyRoutes.patch("/:id", authorize("delete-company"), deleteCompany);
companyRoutes.get("/companyapi/get", authorize("readAll-company"), getAllCompanyApi);

module.exports = companyRoutes;
