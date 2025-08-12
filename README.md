# Workspace Booking System

A comprehensive full-stack web application for booking and managing workspaces, built with Angular 20 (frontend) and Node.js/Express (backend). The system supports multiple user roles including admins, workspace owners, and regular users.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [User Roles](#user-roles)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Functionality
- 🔐 **User Authentication & Authorization** - JWT-based authentication with role-based access
- 👥 **Multi-Role System** - Admin, Owner, and User roles with different permissions
- 🏢 **Workspace Management** - Create, view, edit, and delete workspaces
- 📅 **Booking System** - Book workspaces with date/time selection
- 📊 **Dashboard Systems** - Separate dashboards for admins and owners
- 🎫 **Solutions/Support** - Ticketing system for user support
- 👤 **User Profiles** - Manage user information and view booking history

### Frontend Features
- 📱 **Responsive Design** - Built with Angular 20 and modern CSS
- 🎨 **Tailwind CSS** - Utility-first CSS framework for styling
- 🔄 **HTTP Interceptors** - Authentication, loading, and error handling
- 🛡️ **Route Guards** - Protected routes based on user roles
- 📝 **Form Validation** - Client-side validation for all forms

### Backend Features
- 🚀 **RESTful API** - Clean API endpoints with proper HTTP methods
- 🔒 **Middleware** - Authentication and authorization middleware
- 📊 **Data Models** - Mongoose schemas for all entities
- 🎯 **Error Handling** - Centralized error handling
- 🔄 **CORS Support** - Cross-origin resource sharing enabled

## Tech Stack

### Frontend
- **Framework:** Angular 20.1.0
- **Language:** TypeScript 5.8.2
- **Styling:** Tailwind CSS, Custom CSS
- **HTTP Client:** Angular HTTP Client with RxJS
- **Build Tool:** Angular CLI with ESBuild
- **Testing:** Jasmine, Karma

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 5.1.0
- **Database:** MongoDB with Mongoose 8.16.5
- **Authentication:** JWT (jsonwebtoken 9.0.2)
- **Password Hashing:** bcryptjs 3.0.2
- **Validation:** Joi 17.13.3
- **Environment:** dotenv 17.2.0
- **Development:** Nodemon 3.1.10

### Database
- **Primary:** MongoDB
- **ODM:** Mongoose
- **Schema Validation:** Built-in Mongoose validation

## Project Structure
```
WorkspaceBookingSystem/
├── backend/
│   ├── controller/               # Express controllers
│   │   ├── bookingController.js  # Booking operations
│   │   ├── DashboardController.js # Dashboard data
│   │   ├── solutionsController.js # Support/solutions
│   │   ├── userController.js     # User management
│   │   └── workspaceController.js # Workspace operations
│   ├── middleware/
│   │   └── auth.js              # Authentication & authorization
│   ├── models/                  # Mongoose data models
│   │   ├── bookingModel.js      # Booking schema
│   │   ├── dashboardModel.js    # Dashboard data schema
│   │   ├── tokenBlacklistModel.js # JWT blacklist
│   │   ├── userModel.js         # User schema
│   │   └── workspacesModel.js   # Workspace schema
│   ├── routes/                  # Express route definitions
│   │   ├── booking.js           # Booking endpoints
│   │   ├── Dashboard.js         # Dashboard endpoints
│   │   ├── sloutions.js         # Solutions endpoints
│   │   ├── users.js             # User endpoints
│   │   └── workspace.js         # Workspace endpoints
│   ├── utils/
│   │   └── tokenUtils.js        # JWT utility functions
│   ├── index.js                 # Application entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/       # Reusable Angular components
    │   │   │   ├── footer/       # Footer component
    │   │   │   ├── header/       # Header component
    │   │   │   ├── workspace/    # Workspace display component
    │   │   │   └── workspace-card/ # Workspace card component
    │   │   ├── models/           # TypeScript interfaces
    │   │   │   ├── bookingModel.ts # Booking interfaces
    │   │   │   ├── userModel.ts    # User interfaces
    │   │   │   └── workspaceModel.ts # Workspace interfaces
    │   │   ├── network/          # HTTP services & configuration
    │   │   │   ├── services/     # API service classes
    │   │   │   │   ├── auth.service.ts # Authentication service
    │   │   │   │   ├── booking-api.service.ts # Booking API
    │   │   │   │   ├── solutions-api.service.ts # Solutions API
    │   │   │   │   ├── user-api.service.ts # User API
    │   │   │   │   └── workspace-api.service.ts # Workspace API
    │   │   │   ├── interceptors/ # HTTP interceptors
    │   │   │   │   ├── auth.interceptor.ts # JWT token handling
    │   │   │   │   ├── error.interceptor.ts # Error handling
    │   │   │   │   └── loading.interceptor.ts # Loading states
    │   │   │   └── constants.ts  # API endpoints & constants
    │   │   ├── pages/            # Main page components
    │   │   │   ├── aboutUs/      # About us page
    │   │   │   ├── AdminDashboard/ # Admin dashboard
    │   │   │   ├── Booking/      # Booking page
    │   │   │   ├── home/         # Home page
    │   │   │   ├── login/        # Login page
    │   │   │   ├── notFound/     # 404 page
    │   │   │   ├── OwnerDashboard/ # Owner dashboard
    │   │   │   ├── profile/      # User profile
    │   │   │   ├── register/     # Registration page
    │   │   │   ├── solutions/    # Solutions/support page
    │   │   │   └── workspaces/   # Workspaces listing
    │   │   └── services/         # Additional Angular services
    │   ├── public/               # Static assets
    │   │   ├── favicon.ico
    │   │   ├── img1.jpg
    │   │   └── mohamedEssam.jpg
    │   ├── index.html            # Main HTML file
    │   ├── main.ts              # Bootstrap file
    │   └── styles.css           # Global styles
    ├── angular.json             # Angular configuration
    ├── package.json
    └── tsconfig.json           # TypeScript configuration
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (v4.4 or higher)
- Git

### Backend Setup
1. Navigate to the backend folder:
   ```powershell
   cd backend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/workspace-booking
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   ```

4. Make sure MongoDB is running on your system

5. Start the backend server:
   ```powershell
   npm start
   ```
   The backend will run on `http://localhost:5000`

### Frontend Setup
1. Navigate to the frontend folder:
   ```powershell
   cd frontend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start the Angular development server:
   ```powershell
   npm start
   ```
   The frontend will run on `http://localhost:4200`

4. Open [http://localhost:4200](http://localhost:4200) in your browser

### Development
- Backend uses **nodemon** for auto-restart during development
- Frontend uses **Angular CLI** with live reload
- Both servers need to be running simultaneously for full functionality

## Environment Variables

Create a `.env` file in the backend directory with these required variables:

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/workspace-booking

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRES_IN=7d

# Optional: Database name
DB_NAME=workspace-booking
```

**Important:** Never commit your `.env` file to version control. Add it to `.gitignore`.

## API Endpoints

### Authentication
- `POST /users/login` — User login
- `POST /users/signup` — User registration
- `POST /users/logout` — Logout current session
- `POST /users/logout-all` — Logout all devices
- `GET /users/me` — Get current user profile

### User Management
- `GET /users/me` — Get current user profile
- `PUT /users/me` — Update user profile
- `PATCH /users/me` — Partial user profile update
- `DELETE /users/me` — Delete user account
- `GET /users/token-stats` — Get token statistics

### Workspaces
- `GET /workspaces` — List all workspaces
- `POST /workspaces` — Create new workspace (owner/admin)
- `GET /workspaces/:id` — Get workspace details
- `PUT /workspaces/:id` — Update workspace (owner/admin)
- `DELETE /workspaces/:id` — Delete workspace (owner/admin)

### Booking Management
- `GET /booking` — List user bookings
- `POST /booking` — Create new booking
- `GET /booking/:id` — Get booking details
- `PUT /booking/:id` — Update booking
- `DELETE /booking/:id` — Cancel booking
- `GET /booking/user/:userId` — Get user's booking history

### Solutions/Support
- `GET /sloutions` — List support tickets
- `POST /sloutions` — Create new support ticket
- `GET /sloutions/:id` — Get ticket details
- `PUT /sloutions/:id` — Update ticket status

### Dashboard (Admin/Owner)
- `GET /users/dashboard` — Get dashboard data
- `GET /users/admin-stats` — Get admin statistics

## User Roles

### 👤 User (Regular User)
- Browse and search workspaces
- Book available workspaces
- Manage their bookings
- View booking history
- Create support tickets
- Update their profile

### 🏢 Owner (Workspace Owner)
- All user permissions
- Create and manage their workspaces
- View bookings for their workspaces
- Access owner dashboard
- Manage workspace details and availability

### 👑 Admin (System Administrator)
- All user and owner permissions
- Manage all users and workspaces
- Access admin dashboard
- View system-wide statistics
- Manage support tickets
- User role management

## Contributing

We welcome contributions to the Workspace Booking System! Please follow these guidelines:

### Development Workflow
1. Fork the repository
2. Create a new feature branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Test your changes thoroughly
5. Commit your changes with descriptive messages
6. Push to your branch (`git push origin feature/your-feature-name`)
7. Open a Pull Request

### Code Standards
- **Backend:** Follow Node.js/Express best practices
- **Frontend:** Follow Angular style guide and TypeScript conventions
- **Database:** Use proper Mongoose schema validation
- **Comments:** Write clear, concise comments for complex logic
- **Testing:** Add tests for new features (when applicable)

### Before Submitting
- Ensure your code follows the existing code style
- Test all features work as expected
- Update documentation if needed
- Check that both frontend and backend start without errors

## Scripts

### Backend Scripts
```powershell
npm start          # Start server with nodemon (development)
npm test           # Run tests (placeholder)
```

### Frontend Scripts
```powershell
npm start          # Start Angular dev server
npm run build      # Build for production
npm run watch      # Build and watch for changes
npm test           # Run unit tests with Karma
npm run ng         # Angular CLI commands
```

## License

This project is licensed under the ISC License - see the package.json files for details.

## Author

**NTI MEAN Stack Training 2025 Project**

---

## Additional Notes

- This project is part of the NTI MEAN Stack Training 2025 program
- The application demonstrates modern full-stack development practices
- Features responsive design and modern UI/UX principles
- Implements security best practices with JWT authentication
- Uses TypeScript for improved type safety and developer experience

## Support

If you encounter any issues or have questions, please:
1. Check the existing issues in the repository
2. Create a new issue with detailed description
3. Use the solutions/support system within the application
