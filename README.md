# Personal Finance Manager

A comprehensive personal finance management application built with React, TypeScript, Node.js, and MongoDB.

## 🖼️ Sample Screenshots

Screenshots of the app (Register, Dashboard, and more) are available in the [`screenshots/`](screenshots) folder of this repository.

You can view all images there for a visual overview of the application.

## 🎥 Demo Video

A demo video of the application will be available soon!

To view the demo, check the [`demo/`](demo) folder for `demo.mp4` (or similar) once uploaded.

## 🚀 Features

- **Transaction Management**: Track income and expenses with categories
- **Budget Planning**: Set and monitor monthly budgets
- **Smart Insights**: AI-powered financial insights and recommendations
- **Calendar View**: Visualize financial activities over time
- **Reminders**: Set up bill reminders and recurring payments
- **Data Export**: Export your financial data in various formats
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Shadcn/ui components
- React Router for navigation
- Date-fns for date manipulation

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- CORS enabled

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🗄️ MongoDB Configuration

This app requires a MongoDB database. You have two options:

### Option 1: Local MongoDB

1. [Download MongoDB Community Server](https://www.mongodb.com/try/download/community) and install it.
2. Start MongoDB on your computer (default URL: `mongodb://localhost:27017`).
3. Use the following in your `.env` file:
   ```
   MONGO_URI=mongodb://localhost:27017/your_database_name
   ```

### Option 2: MongoDB Atlas (Cloud, Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Create a new cluster (use the free tier).
3. Add a database user and password.
4. Get your connection string (something like `mongodb+srv://<user>:<password>@cluster0.mongodb.net/your_db?retryWrites=true&w=majority`).
5. Use this in your `.env` file:
   ```
   MONGO_URI=your_connection_string_here
   ```

*If you're new to MongoDB, [this guide](https://www.mongodb.com/docs/manual/introduction/) can help you get started.*

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Environment Setup**
   
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/your_database_name
   PORT=5000
   JWT_SECRET=your_secure_jwt_secret_here
   ```
   
   Create a `.env` file in the root directory for frontend:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Start the development servers**
   ```bash
   # Start backend server
   cd backend
   npm start
   
   # In a new terminal, start frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🔒 Security Features

### ✅ Implemented Security Measures

1. **Environment Variables**: All sensitive data is stored in `.env` files
2. **JWT Authentication**: Secure token-based authentication
3. **Password Hashing**: Passwords are hashed using bcrypt
4. **CORS Protection**: Cross-origin requests are properly configured
5. **Input Validation**: Server-side validation for all inputs
6. **No Hardcoded Credentials**: All URLs and secrets use environment variables

### 🛡️ Security Checklist

- [x] `.env` files are in `.gitignore`
- [x] No hardcoded localhost URLs in production code
- [x] Sensitive console logs removed
- [x] API endpoints protected with authentication
- [x] Input sanitization implemented
- [x] CORS properly configured

## 📁 Project Structure

```