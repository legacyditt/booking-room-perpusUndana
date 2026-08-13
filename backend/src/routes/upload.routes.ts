import { Router } from "express";
import multer from "multer";
import { requireAdmin } from "../middleware/auth";
import { uploadRoomImage } from "../lib/storage";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) return cb(null, true);
    cb(new Error("Hanya file gambar yang diperbolehkan."));
  },
});

router.post("/room-image", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File gambar wajib diunggah." });
    }

    const key = await uploadRoomImage(req.file);
    return res.status(201).json({ data: { key } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
