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

## 📁 Folder Structure

# Event Management Admin Portal - Project Structure

This document outlines the folder structure of the **Event_Managment_Admin_portal** project, formatted for clarity and easy navigation.

```plaintext
Event_Managment_Admin_portal/
├── README.md
├── frontend/
│   ├── index.html
│   └── src/
│       ├── assets/           # Static assets like images and icons
│       ├── components/       # Component cards for catering, events, and users
│       ├── contexts/         # Store protected routes and context providers
│       ├── pages/            # Admin pages (dashboard, event list, etc.)
│       ├── utils/            # User authentication utilities
│       ├── api.js            # All APIs from backend
│       ├── App.jsx           # Main React component
│       └── index.css         # Global stylesheets
└── backend/
    ├── seed.js              # Faker script for inserting data into the database
    ├── server.js            # Entry point for the backend server
    └── src/
        ├── config/          # Database, Swagger, and Multer configuration
        ├── controllers/     # Controllers for user, events, and catering
        ├── middlewares/     # Middleware for authentication
        ├── models/          # Sequelize database models
        ├── routes/          # Routes for users, events, and catering
        └── uploads/         # Stores uploaded images
```

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
