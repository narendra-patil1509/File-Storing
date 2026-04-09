# Full-Stack File & Notes Storage Application

A robust full-stack application built for storing files and managing notes securely. The project provides user authentication, file uploads with previews, and note-taking capabilities, all supported by a modern React frontend and an Express.js backend using a filesystem-based storage model.

## Features
- **User Authentication**: Secure sign-up and login utilizing JSON Web Tokens (JWT) and bcryptjs.
- **File Storage System**: Upload, store, and preview files through Multer and a local file system approach.
- **Notes Management**: Create, view, and manage comprehensive text notes connected securely to user profiles.
- **Modern UI**: Designed with React 19, Tailwind CSS, Lucide React icons, and a premium layout ensuring responsive interfaces and modern aesthetics.
- **Filesystem Database**: Lightweight JSON files (e.g. `data/users.json`) act as a persistent data store natively on the server side without requiring a local database infrastructure.

## Technologies Used

**Frontend:**
- React (via Vite)
- Tailwind CSS
- React Router DOM
- Axios

**Backend:**
- Node.js & Express.js
- Multer (File Handling)
- JSON Web Tokens (JWT)
- bcryptjs
- dotenv

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.

---

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root of the `backend` directory. Add the following values:
   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. **Run the server:**
   ```bash
   node server.js
   ```
   The backend API will respond on `http://localhost:5000`. The server will automatically generate necessary directories for file storage (`uploads/`) and database storage (`data/`) on initialization.

---

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The React application frontend will now be available through the Vite development server link standard output (usually `http://localhost:5173`).

## Project Structure
- **/backend**: Contains Express API routes, auth logic, middlewares, data handling, and file uploading functionality.
- **/frontend**: Houses dynamic React components, modular pages, API caller utilities, routing logic, and global/application Tailwind layout settings.
