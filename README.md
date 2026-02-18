#  Task Manager API

A simple Task Management REST API built with **Node.js**, **Express.js**, and **MongoDB**. Users can register, log in, and manage their personal to-do tasks with filtering, sorting, and pagination support.

---

##  Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Auth:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Error Handling:** express-async-handler
- **Module System:** ES Modules (`import/export`)

---

##  Project Structure
```
task-manager/
├── config/
│   └── database.config.js
├── controllers/
│   ├── auth.controller.js
│   └── task.controller.js
├── middlewares/
│   ├── auth.middleware.js
│   └── error.middleware.js
├── models/
│   ├── task.model.js
│   └── user.model.js
├── routes/
│   ├── auth.route.js
│   └── task.route.js
├── .env
├── .env-sample
├── .gitignore
├── Bug.md
├── package.json
└── server.js
```

---

##  Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/avinash-25/task-manager.git
cd task-manager
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env-sample .env
```

Open `.env` and fill in your values:
```env
PORT=9000
MONGO_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
```

### 4. Start the server
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

Server will run at: `http://localhost:9000`

---

## 🔐 Authentication

This API uses **JWT Bearer Token** authentication.

After registering or logging in, copy the token from the response and include it in the header of all protected requests:
```
Authorization: Bearer <your_token_here>
```

---

## 📡 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|------------------|--------------------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive a JWT | No |

> 🛡️ Auth routes are protected by a **rate limiter** to prevent brute-force attacks.

---

### Task Routes — `/api/tasks`

| Method | Endpoint | Description | Auth Required |
|--------|----------------------------------|-------------------------------|---------------|
| GET | `/api/tasks/all` | Get all tasks | No |
| POST | `/api/tasks/add` | Create a new task | Yes |
| PUT | `/api/tasks/update/:id` | Update a task by ID | Yes |
| DELETE | `/api/tasks/delete/:id` | Delete a task by ID | Yes |
| PATCH | `/api/tasks/update-status/:id` | Update task status only | No |

---

## 📘 API Usage Examples

### Register a User

**POST** `/api/auth/register`
```json
{
  "name": "Avinash",
  "email": "avinash@example.com",
  "password": "secret123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Avinash",
    "email": "avinash@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Login

**POST** `/api/auth/login`
```json
{
  "email": "avinash@example.com",
  "password": "secret123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Avinash",
    "email": "avinash@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Get All Tasks

**GET** `/api/tasks/all`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "title": "Fix login bug",
      "description": "Password comparison is broken",
      "status": "pending",
      "priority": "high",
      "dueDate": "2025-12-31T00:00:00.000Z",
      "createdBy": "64f1a2b3c4d5e6f7a8b9c0d1",
      "createdAt": "2025-01-01T10:00:00.000Z"
    }
  ]
}
```

---

### Create a Task

**POST** `/api/tasks/add` 🔒
```json
{
  "title": "Fix login bug",
  "description": "Password comparison is broken",
  "status": "pending",
  "priority": "high",
  "dueDate": "2025-12-31"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task created",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "title": "Fix login bug",
    "status": "pending",
    "priority": "high",
    "dueDate": "2025-12-31T00:00:00.000Z",
    "createdBy": "64f1a2b3c4d5e6f7a8b9c0d1",
    "createdAt": "2025-01-01T10:00:00.000Z"
  }
}
```

---

### Update a Task

**PUT** `/api/tasks/update/:id` 🔒
```json
{
  "title": "Updated title",
  "status": "in-progress",
  "priority": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task updated",
  "data": { }
}
```

---

### Update Task Status Only

**PATCH** `/api/tasks/update-status/:id`
```json
{
  "status": "done"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task status updated",
  "data": { }
}
```

---

### Delete a Task

**DELETE** `/api/tasks/delete/:id` 🔒

**Response:**
```json
{
  "success": true,
  "message": "Task deleted"
}
```

---

## 🗂️ Task Schema

| Field | Type | Required | Notes |
|-------------|----------|----------|---------------------------------------|
| `title` | String | ✅ | - |
| `description` | String | ❌ | Optional |
| `status` | String | ❌ | `pending` / `in-progress` / `done` |
| `priority` | String | ❌ | `low` / `medium` / `high` |
| `dueDate` | Date | ❌ | Optional |
| `createdBy` | ObjectId | ✅ | Auto-set from JWT token |
| `createdAt` | Date | ✅ | Auto-generated |

---

## 🐛 Known Bug

An intentional bug has been introduced as part of the assignment requirements. See **[Bug.md](./Bug.md)** for a full description of the bug, its location in the code, and the correct fix.

---

## 📦 Key Dependencies

| Package | Purpose |
|---------------------|-------------------------------|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `jsonwebtoken` | JWT auth |
| `bcryptjs` | Password hashing |
| `express-async-handler` | Async error handling |
| `express-rate-limit` | Rate limiting on auth routes |
| `dotenv` | Environment variable management |
