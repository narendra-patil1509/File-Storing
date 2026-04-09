const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usersFile = path.join(__dirname, '../data/users.json');
const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret_key';

const readUsers = () => JSON.parse(fs.readFileSync(usersFile, 'utf8'));
const writeUsers = (users) => fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

exports.register = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    let users = readUsers();
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now().toString(), username, password: hashedPassword };
    
    users.push(newUser);
    writeUsers(users);

    // Create user-specific uploads folder
    const userUploadsDir = path.join(__dirname, `../uploads/${newUser.id}`);
    if (!fs.existsSync(userUploadsDir)) fs.mkdirSync(userUploadsDir);

    // Create user-specific notes file
    const notesFile = path.join(__dirname, `../data/${newUser.id}_notes.json`);
    if (!fs.existsSync(notesFile)) fs.writeFileSync(notesFile, JSON.stringify([]));

    res.status(201).json({ message: 'User registered successfully' });
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    const users = readUsers();
    const user = users.find(u => u.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username } });
};
