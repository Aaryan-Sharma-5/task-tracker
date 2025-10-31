# Scalable REST API with Authentication & Role-Based Access

A full-stack application featuring a scalable REST API backend with JWT authentication, role-based access control, and a React frontend for task management.

## 🚀 Features

### Backend
- ✅ **User Authentication**: Register, login with JWT tokens and bcrypt password hashing
- ✅ **Role-Based Access Control**: User and Admin roles with protected routes
- ✅ **CRUD Operations**: Complete task management system
- ✅ **API Versioning**: v1 API structure for future scalability
- ✅ **Input Validation**: Express-validator for request validation
- ✅ **Security Features**:
  - Helmet for security headers
  - Rate limiting to prevent abuse
  - MongoDB sanitization to prevent NoSQL injection
  - XSS protection
  - CORS configuration
- ✅ **Logging**: Winston logger for application monitoring
- ✅ **Error Handling**: Centralized error handling with proper status codes
- ✅ **API Documentation**: Swagger/OpenAPI documentation

### Frontend
- ✅ **React Application**: Modern React with hooks
- ✅ **Authentication UI**: Login and registration pages
- ✅ **Protected Routes**: JWT-based route protection
- ✅ **Task Management**: Full CRUD interface for tasks
- ✅ **Dashboard**: Statistics and task overview

## 📁 Project Structure

```
task-tracker/
├── backend/
│   ├── config/
│   │   ├── config.js          # Environment configuration
│   │   ├── database.js        # MongoDB connection
│   │   └── swagger.js         # API documentation setup
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── taskController.js  # Task CRUD logic
│   ├── middleware/
│   │   ├── auth.js            # JWT verification & role authorization
│   │   ├── errorHandler.js    # Global error handling
│   │   └── validate.js        # Request validation
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Task.js            # Task schema
│   ├── routes/
│   │   ├── authRoutes.js      # Authentication routes
│   │   └── taskRoutes.js      # Task routes
│   ├── utils/
│   │   ├── AppError.js        # Custom error class
│   │   ├── logger.js          # Winston logger
│   │   └── responseHandler.js # Standardized responses
│   ├── validators/
│   │   ├── authValidator.js   # Auth validation rules
│   │   └── taskValidator.js   # Task validation rules
│   ├── .env                   # Environment variables
│   ├── package.json
│   ├── server.js              # Application entry point
│   └── postman_collection.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js       # Navigation component
    │   │   ├── PrivateRoute.js # Route protection
    │   │   └── TaskModal.js    # Task create/edit modal
    │   ├── pages/
    │   │   ├── Dashboard.js    # Main dashboard
    │   │   ├── Login.js        # Login page
    │   │   └── Register.js     # Registration page
    │   ├── services/
    │   │   ├── api.js          # Axios configuration
    │   │   ├── authService.js  # Auth API calls
    │   │   └── taskService.js  # Task API calls
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: Helmet, express-rate-limit, mongo-sanitize, xss-clean
- **Logging**: Winston
- **Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Custom CSS

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Update the following variables:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/scalable-api
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Start MongoDB**
   ```bash
   # Windows (if installed as service)
   net start MongoDB

   # Or using mongod directly
   mongod
   ```

5. **Run the backend**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

   The backend will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

## 📚 API Documentation

### Access Swagger Documentation
Once the backend is running, visit: `http://localhost:5000/api-docs`

### API Endpoints

#### Authentication (`/api/v1/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /me` - Get current user (Protected)
- `PUT /profile` - Update user profile (Protected)
- `PUT /password` - Update password (Protected)

#### Tasks (`/api/v1/tasks`)
- `GET /tasks` - Get all tasks for logged-in user (Protected)
- `GET /tasks/:id` - Get single task (Protected)
- `POST /tasks` - Create new task (Protected)
- `PUT /tasks/:id` - Update task (Protected)
- `DELETE /tasks/:id` - Delete task (Protected)
- `GET /tasks/stats/summary` - Get task statistics (Protected)

### Postman Collection
Import `backend/postman_collection.json` into Postman for ready-to-use API requests.

## 🔐 Authentication Flow

1. **Register/Login**: User provides credentials
2. **Token Generation**: Server generates JWT token
3. **Token Storage**: Frontend stores token in localStorage
4. **Authenticated Requests**: Token sent in Authorization header
5. **Token Verification**: Middleware verifies token on protected routes

## 👥 User Roles

- **User**: Can manage their own tasks
- **Admin**: Can manage all tasks (role-based access ready for expansion)

## 🔒 Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Password Hashing**: bcrypt with salt rounds
3. **Rate Limiting**: 100 requests per 15 minutes per IP
4. **Input Validation**: All inputs validated and sanitized
5. **NoSQL Injection Prevention**: MongoDB sanitization
6. **XSS Protection**: Content sanitization
7. **Security Headers**: Helmet.js configuration
8. **CORS**: Configured for specific origins

## 📈 Scalability Considerations

### Current Implementation
1. **Modular Architecture**: Separation of concerns (MVC pattern)
2. **API Versioning**: v1 endpoints for backward compatibility
3. **Database Indexing**: Optimized queries with proper indexes
4. **Error Handling**: Centralized error management
5. **Logging**: Comprehensive logging for monitoring

## 📊 Database Schema

### User Schema
```javascript
{
  name: String (required, max 50 chars)
  email: String (required, unique, validated)
  password: String (required, hashed, min 6 chars)
  role: String (enum: ['user', 'admin'], default: 'user')
  isActive: Boolean (default: true)
  timestamps: true
}
```

### Task Schema
```javascript
{
  title: String (required, max 100 chars)
  description: String (required, max 500 chars)
  status: String (enum: ['pending', 'in-progress', 'completed'])
  priority: String (enum: ['low', 'medium', 'high'])
  dueDate: Date (optional)
  user: ObjectId (ref: User, required)
  timestamps: true
}
```

## �‍ Author

Created as a demonstration of scalable REST API architecture with modern security practices.