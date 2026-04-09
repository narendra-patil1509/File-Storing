const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadFile, getFiles, deleteFile, renameFile, downloadFile } = require('../controllers/fileController');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userDir = path.join(__dirname, `../uploads/${req.user.id}`);
        if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
        cb(null, userDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post('/upload', authMiddleware, upload.single('file'), uploadFile);
router.get('/files', authMiddleware, getFiles);
router.get('/files/download/:filename', authMiddleware, downloadFile);
router.delete('/files/:filename', authMiddleware, deleteFile);
router.put('/files/rename', authMiddleware, renameFile);

module.exports = router;
