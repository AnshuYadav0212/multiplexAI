import fs from "fs";
import path from "path";
import multer from "multer";

const uploadDirectory = path.resolve("./temp");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.minetype == "application/pdf" ||
    file.minetype.startsWith("image/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid document type, Only Images & PDFs are allowed."));
  }
};
export default multer({ storage, fileFilter, limits: 30 * 1024 * 1024 });
