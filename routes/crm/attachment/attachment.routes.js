const express = require("express");
const attachmentRoutes = express.Router();
const crypto = require("crypto"); // for generating random names
const multer = require("multer");
const {
  createAttachment,
  getAllAttachments,
  getSingleAttachment,
  deleteAttachment,
} = require("./attachment.controller");
const authorize = require("../../../utils/authorize");

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

attachmentRoutes.post(
  "/",
  upload.array("files", 1),
  authorize("create-attachment"),
  createAttachment
);
attachmentRoutes.get("/", authorize("readAll-attachment"), getAllAttachments);
attachmentRoutes.get(
  "/:id",
  authorize("readSingle-attachment"),
  getSingleAttachment
);
attachmentRoutes.delete(
  "/:id",
  authorize("delete-attachment"),
  deleteAttachment
);

module.exports = attachmentRoutes;
