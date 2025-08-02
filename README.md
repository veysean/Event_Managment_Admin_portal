# 🎫 Event Management Admin Portal

This is a simple **Admin Portal** for managing events. It provides a basic interface for administrators to view and manage event-related data. The project is built using HTML, Tailwind CSS, and JavaScript for backend logic.

## 📌 Overview

The portal includes:

- A dashboard for quick access to admin features.
- Pages for managing events, users, and catering.
- Static assets for styling and interactivity.

## 🚀 Features

- Admin Dashboard: Overview of system metrics and quick access to key functionalities.
- Event Management: Create, update, and delete events with detailed information.
- User Management: Manage user CRUD for employees and customers.
- Authentication: Secure login system for administrators.
- Responsive Design: Optimized for desktop and mobile devices.

## 🧰 Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: JavaScript
- **Database**: MySQL
- **Version Control**: GitHub

# Images and static files

├── css/  
├── js/  
├── pages/  
├── index.html  
└── README.md # Project documentation

## 📁 Folder Structure

Event_Managment_Admin_portal/
├── frontend/
│   ├── index.html
│   └── src/
│       ├── assets/
│       ├── components/        # Component cards for catering, events, and users
│       ├── contexts/          # Store protected routes
│       ├── pages/             # Admin pages (dashboard, event list, etc.)
│       ├── utils/             # User authentication
│       ├── api.js             # All APIs from backend
│       ├── App.jsx
│       └── index.css          # Stylesheets
├── backend/
│   ├── seed.js                # Faker for inserting data into database
│   ├── server.js
│   └── src/
│       ├── config/            # Database, Swagger, and Multer (upload image) configuration
│       ├── controllers/       # Controllers for user, events, and catering
│       ├── middlewares/       # Middleware for authentication
│       ├── models/            # Database models in Sequelize
│       ├── routes/            # Routes for users, events, and catering
│       └── uploads/           # Store images
└── README.md

## 🚀 Getting Started

This project is a full-stack Event Management Admin Portal built with:

- **Frontend**: React
- **Backend**: Node.js with Express.js

### 📦 Prerequisites

Make sure you have the following installed:

- Node.js (v18 or later)
- npm

---

To run this project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/veysean/Event_Managment_Admin_portal.git
   ```

### 🖥️ Frontend Setup (React)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. To run frontend:
   ```bash
   npm run dev
   ```

### 🔧 Backend Setup (Node.js + Express)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. To run backend:
   ```bash
   cd src
   node server.js
   ```
