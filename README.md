# Workspace Booking System

A full-stack web application for booking and managing workspaces, built with Angular (frontend) and Node.js/Express (backend).

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features
- User registration and authentication (JWT)
- Workspace listing and booking
- Admin and owner dashboards
- Booking management
- Solutions and support system
- Responsive UI

## Tech Stack
- **Frontend:** Angular
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT

## Project Structure
```
WorkspaceBookingSystem/
├── backend/
│   ├── controller/           # Express controllers
│   ├── middleware/           # Auth and other middleware
│   ├── models/               # Mongoose models
│   ├── routes/               # Express routes
│   ├── utils/                # Utility functions
│   ├── index.js              # Entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/   # Angular components
    │   │   ├── models/       # TypeScript models
    │   │   ├── network/      # HTTP services & interceptors
    │   │   ├── pages/        # Page components
    │   │   └── services/     # Angular services
    │   └── ...
    ├── angular.json
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- npm
- MongoDB

### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file for environment variables (e.g., MongoDB URI, JWT secret).
4. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the Angular development server:
   ```sh
   npm start
   ```
4. Open [http://localhost:4200](http://localhost:4200) in your browser.

## API Endpoints

### Auth
- `POST /api/users/register` — Register a new user
- `POST /api/users/login` — User login

### Workspaces
- `GET /api/workspace` — List all workspaces
- `POST /api/workspace` — Add a new workspace (admin/owner)

### Booking
- `POST /api/booking` — Book a workspace
- `GET /api/booking` — List bookings (user/admin)

### Solutions
- `GET /api/solutions` — List solutions/support tickets
- `POST /api/solutions` — Create a new solution/support ticket

### Dashboard
- `GET /api/dashboard` — Admin dashboard data

## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

## License
This project is licensed under the MIT License.
