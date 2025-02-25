import express from 'express';
import multer from 'multer';
import { uploadProfilePicture } from '../controllers/uploadController';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('image'), uploadProfilePicture);

export default router;
