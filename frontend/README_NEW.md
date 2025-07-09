# Cab Booking System - Frontend

A modern, responsive React frontend for the Cab Booking System built with Vite, featuring real-time ride booking, driver management, and user authentication.

## 🚀 Features

### For Users
- **User Authentication**: Secure registration and login
- **Ride Booking**: Interactive map-based ride booking with real-time fare calculation
- **Live Tracking**: Real-time ride status updates
- **Ride History**: Complete history of all rides with receipts
- **Payment Integration**: Multiple payment options (Card, Cash, UPI)
- **Rating System**: Rate drivers and provide feedback
- **Profile Management**: Update personal information

### For Drivers
- **Driver Dashboard**: Comprehensive dashboard with earnings and ride statistics
- **Availability Toggle**: Online/Offline status management
- **Ride Requests**: View and accept incoming ride requests
- **Navigation**: Built-in navigation to pickup and drop-off locations
- **Ride Management**: Start, track, and complete rides
- **Earnings Tracking**: Real-time earnings and ride history

### Technical Features
- **Responsive Design**: Mobile-first, works on all devices
- **Real-time Updates**: Live ride status and location updates
- **Interactive Maps**: Leaflet integration for location services
- **Modern UI**: Clean, intuitive interface with smooth animations
- **JWT Authentication**: Secure token-based authentication
- **API Integration**: Complete integration with Spring Boot backend

## 🛠️ Technology Stack

- **React 19.1.0** - UI Framework
- **Vite 7.0.3** - Build tool and development server
- **React Router Dom 7.6.3** - Client-side routing
- **Axios 1.10.0** - HTTP client for API calls
- **React Leaflet 5.0.0** - Interactive maps
- **React Hook Form 7.60.0** - Form handling
- **Yup 1.6.1** - Schema validation
- **ESLint** - Code linting and formatting

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and static files
│   ├── components/        # Reusable components
│   │   ├── ProtectedRoute.jsx
│   │   ├── ProfilePopup.jsx
│   │   └── RoleSwitchForm.jsx
│   ├── pages/             # Page components
│   │   ├── Home/          # Landing page
│   │   ├── Login/         # Authentication
│   │   ├── Register/      # User registration
│   │   ├── User/          # User-specific pages
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── Booking.jsx
│   │   │   ├── CurrentRide.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── RideHistory.jsx
│   │   └── Driver/        # Driver-specific pages
│   │       ├── DriverDashboard.jsx
│   │       ├── CurrentRide.jsx
│   │       └── Availability.jsx
│   ├── routes/            # Route configuration
│   │   └── AppRouter.jsx
│   ├── services/          # API service layer
│   │   ├── authService.js
│   │   ├── rideService.js
│   │   ├── paymentService.js
│   │   └── ratingService.js
│   ├── utils/             # Utility functions
│   └── App.jsx            # Main app component
├── package.json
└── vite.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Backend server running on `http://localhost:8081`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8081/api
   VITE_MAP_PROVIDER=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

## 🌐 API Integration

The frontend integrates with the backend through dedicated service layers:

### Auth Service (`authService.js`)
- User/Driver registration and login
- JWT token management
- Profile management

### Ride Service (`rideService.js`)
- Ride booking and management
- Driver availability updates
- Ride history and current ride status

### Payment Service (`paymentService.js`)
- Payment processing
- Receipt generation

### Rating Service (`ratingService.js`)
- Driver rating submission
- Rating history

## 🎨 UI Components

### Core Components
- **UserDashboard**: Main user interface with ride status and quick actions
- **DriverDashboard**: Driver interface with availability toggle and ride requests
- **Booking**: Interactive ride booking with map integration
- **CurrentRide**: Real-time ride tracking and management
- **ProtectedRoute**: Authentication wrapper for secure routes

### Styling
- CSS Modules for component-specific styles
- Responsive design with mobile-first approach
- Modern UI with smooth animations and transitions

## 🔐 Authentication Flow

1. **Registration**: Users can register as either USER or DRIVER
2. **Login**: JWT token-based authentication
3. **Protected Routes**: Role-based access control
4. **Auto-redirect**: Automatic redirection based on user role

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Tablet support**: Responsive grid layouts
- **Desktop**: Full-featured desktop experience
- **Cross-browser**: Compatible with modern browsers

## 🚗 Key Features Implementation

### Map Integration
- Real-time location tracking using Leaflet
- Interactive markers for pickup/dropoff
- Route visualization
- Distance and fare calculation

### Real-time Updates
- Live ride status updates
- Driver location tracking (planned)
- Push notifications (planned)

### Payment System
- Multiple payment methods
- Secure payment processing
- Receipt generation

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Code Quality
- ESLint configuration for code quality
- Consistent naming conventions
- Component-based architecture
- Service layer abstraction

## 🚀 Deployment

### Build Production Version
```bash
npm run build
```

### Deploy to Static Hosting
The built files in the `dist` folder can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

### Environment Variables
Set the following environment variables in production:
- `VITE_API_BASE_URL`: Backend API URL
- `VITE_MAP_PROVIDER`: Map tile provider URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `/docs` folder

---

Built with ❤️ using React and Vite
