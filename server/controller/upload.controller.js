import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadRoot = path.join(__dirname, "..", "uploads");

/** Allowed upload subfolders under /uploads */
export const UPLOAD_FOLDERS = [
  "products",
  "categories",
  "brands",
  "accessories",
  "misc",
];

function resolveFolder(raw) {
  const folder = String(raw || "misc")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");
  if (!UPLOAD_FOLDERS.includes(folder)) {
    return "misc";
  }
  return folder;
}

function ensureFolder(folder) {
  const dir = path.join(uploadRoot, folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = resolveFolder(req.query.folder || req.body?.folder);
    req.uploadFolder = folder;
    cb(null, ensureFolder(folder));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
});

function publicUrl(req, filename) {
  const folder = req.uploadFolder || resolveFolder(req.query.folder);
  const base = `${req.protocol}://${req.get("host")}`;
  return `${base}/uploads/${folder}/${filename}`;
}

export function uploadSingle(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({
    imageUrl: publicUrl(req, req.file.filename),
    folder: req.uploadFolder,
  });
}

export function uploadMultiple(req, res) {
  if (!req.files?.length) {
    return res.status(400).json({ message: "No files uploaded" });
  }
  const imageUrls = req.files.map((f) => publicUrl(req, f.filename));
  res.json({
    imageUrls,
    folder: req.uploadFolder,
  });
}
