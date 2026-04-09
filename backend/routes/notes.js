const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getNotes, createNote, updateNote, deleteNote } = require('../controllers/noteController');

const router = express.Router();

router.get('/notes', authMiddleware, getNotes);
router.post('/notes', authMiddleware, createNote);
router.put('/notes/:id', authMiddleware, updateNote);
router.delete('/notes/:id', authMiddleware, deleteNote);

module.exports = router;
