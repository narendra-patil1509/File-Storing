const fs = require('fs');
const path = require('path');

const getNotesFile = (userId) => path.join(__dirname, `../data/${userId}_notes.json`);

const readNotes = (userId) => {
    const file = getNotesFile(userId);
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf8'));
};

const writeNotes = (userId, notes) => {
    fs.writeFileSync(getNotesFile(userId), JSON.stringify(notes, null, 2));
};

exports.getNotes = (req, res) => {
    const notes = readNotes(req.user.id);
    // Sort notes descending by update time
    notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    res.json(notes);
};

exports.createNote = (req, res) => {
    const { title, content } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const notes = readNotes(req.user.id);
    const newNote = {
        id: Date.now().toString(),
        title,
        content: content || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    notes.push(newNote);
    writeNotes(req.user.id, notes);
    res.status(201).json(newNote);
};

exports.updateNote = (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    let notes = readNotes(req.user.id);
    const noteIndex = notes.findIndex(n => n.id === id);

    if (noteIndex === -1) return res.status(404).json({ error: 'Note not found' });

    notes[noteIndex] = {
        ...notes[noteIndex],
        ...((title !== undefined) && { title }),
        ...((content !== undefined) && { content }),
        updatedAt: new Date().toISOString()
    };

    writeNotes(req.user.id, notes);
    res.json(notes[noteIndex]);
};

exports.deleteNote = (req, res) => {
    const { id } = req.params;

    let notes = readNotes(req.user.id);
    const filteredNotes = notes.filter(n => n.id !== id);

    if (notes.length === filteredNotes.length) return res.status(404).json({ error: 'Note not found' });

    writeNotes(req.user.id, filteredNotes);
    res.json({ message: 'Note deleted' });
};
