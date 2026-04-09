const fs = require('fs');
const path = require('path');

exports.uploadFile = (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.status(201).json({ message: 'File uploaded successfully', file: req.file });
};

exports.getFiles = (req, res) => {
    const userDir = path.join(__dirname, `../uploads/${req.user.id}`);
    if (!fs.existsSync(userDir)) {
        return res.json([]);
    }

    fs.readdir(userDir, (err, files) => {
        if (err) return res.status(500).json({ error: 'Failed to read directory' });

        const fileStats = files.map(file => {
            const stats = fs.statSync(path.join(userDir, file));
            return {
                name: file,
                size: stats.size,
                createdAt: stats.birthtime,
                url: `/uploads/${req.user.id}/${file}`
            };
        });

        // Sort by created date descending
        fileStats.sort((a, b) => b.createdAt - a.createdAt);

        res.json(fileStats);
    });
};

exports.downloadFile = (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, `../uploads/${req.user.id}/${filename}`);

    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ error: 'File not found' });
    }
};

exports.deleteFile = (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, `../uploads/${req.user.id}/${filename}`);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.json({ message: 'File deleted' });
    } else {
        res.status(404).json({ error: 'File not found' });
    }
};

exports.renameFile = (req, res) => {
    const { oldName, newName } = req.body;
    const userDir = path.join(__dirname, `../uploads/${req.user.id}`);
    const oldPath = path.join(userDir, oldName);
    const newPath = path.join(userDir, newName);

    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        res.json({ message: 'File renamed successfully' });
    } else {
        res.status(404).json({ error: 'File not found' });
    }
};
