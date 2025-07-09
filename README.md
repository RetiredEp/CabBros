# CabBros - Cab Booking System

A surprisingly functional full-stack cab booking application built by some bros who know Spring Boot and React.

## 🚀 Project Overview

This is our take on a cab booking system. It actually works! Users can book rides, drivers can accept them, and we even built a payment selection UI (though we won't charge your card). It's got authentication, state management, and everything you'd expect from a demo project that went a bit too far.

## 📋 What We Actually Built

### User Features
- **User Registration & Authentication**: Secure user registration and login
- **Ride Booking**: Book rides with pickup and dropoff locations
- **Real-time Tracking**: Track ride status and driver location
- **Payment Processing**: Secure payment integration
- **Ride History**: View past rides and receipts
- **Rating System**: Rate drivers and provide feedback
- **Profile Management**: Update user information

### Driver Features
- **Driver Registration & Authentication**: Separate driver registration with vehicle details
- **Availability Toggle**: Go online/offline to receive ride requests
- **Ride Management**: Accept, start, and complete rides
- **Earnings Tracking**: View ride history and earnings
- **Profile Management**: Update driver and vehicle information

### Admin Features
- **User Management**: View and manage users and drivers
- **Ride Monitoring**: Monitor all rides in real-time
- **Analytics**: View system statistics and reports

## 🛠️ Technology Stack

### Backend
- **Java 17** with **Spring Boot 3.2**
- **Spring Security** for authentication and authorization
- **Spring Data JPA** with **H2 Database** (development) / **MySQL** (production)
- **Maven** for dependency management
- **JWT** for stateless authentication
- **Spring Boot Actuator** for monitoring

### Frontend
- **React 18** with **Vite**
- **React Router** for navigation
- **Axios** for API calls
- **Leaflet Maps** for location services
- **CSS3** with modern responsive design
- **ESLint** for code quality

## 📁 Project Structure

```
CAB/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/com/cabbookingsystem/
│   │   ├── config/            # Configuration classes
│   │   ├── controller/        # REST API controllers
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── entity/           # JPA entities
│   │   ├── repository/       # Data repositories
│   │   ├── service/          # Business logic services
│   │   └── security/         # Security configurations
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── DOCS/                 # API documentation
│   ├── API documentation/    # Detailed API docs
│   └── module-architecture_Documentation/
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   │   ├── User/        # User-specific pages
│   │   │   ├── Driver/      # Driver-specific pages
│   │   │   ├── Home/        # Landing page
│   │   │   ├── Login/       # Authentication pages
│   │   │   └── Register/
│   │   ├── services/        # API service functions
│   │   ├── routes/          # Routing configuration
│   │   ├── styles/          # Global styles
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json
└── logs/                     # Application logs
```

## 🚀 Getting Started

### Prerequisites
- **Java 17** or higher
- **Node.js 16** or higher
- **npm** or **yarn**
- **Git**

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CAB/backend
   ```

2. **Build and run the backend**
   ```bash
   # Using Maven wrapper
   ./mvnw spring-boot:run
   
   # Or if you have Maven installed
   mvn spring-boot:run
   ```

3. **The backend will be available at**
   ```
   http://localhost:8081
   ```

4. **API Documentation**
   - Swagger UI: `http://localhost:8081/swagger-ui.html`
   - API Docs: Check `/backend/DOCS/` directory

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd CAB/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **The frontend will be available at**
   ```
   http://localhost:5173
   ```

## 📊 Database Schema

The application uses the following main entities:

- **User**: User account information
- **Driver**: Driver account and vehicle details
- **Ride**: Ride booking and status information
- **Payment**: Payment transaction records
- **Rating**: User ratings and feedback

## 🔐 Authentication & Security

- **JWT-based authentication** for stateless sessions
- **Role-based access control** (USER, DRIVER, ADMIN)
- **Password encryption** using BCrypt
- **CORS configuration** for cross-origin requests
- **Input validation** and **SQL injection prevention**

## 🗺️ API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/drivers/register` - Driver registration
- `POST /api/drivers/login` - Driver login

### User Operations
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/rides/book` - Book a new ride
- `GET /api/rides/current` - Get current ride
- `GET /api/rides/history` - Get ride history

### Driver Operations
- `GET /api/drivers/profile` - Get driver profile
- `PUT /api/drivers/profile` - Update driver profile
- `PUT /api/drivers/availability` - Toggle availability
- `GET /api/rides/available` - Get available ride requests
- `POST /api/rides/{id}/accept` - Accept a ride
- `PUT /api/rides/{id}/status` - Update ride status

### Payment & Rating
- `POST /api/payments/process` - Process payment
- `POST /api/ratings` - Submit rating
- `GET /api/ratings/driver/{id}` - Get driver ratings

For complete API documentation, see `/backend/DOCS/api_endpoints_examples.md`

## 🧪 Testing

### Backend Testing
```bash
cd backend
./mvnw test
```

### Frontend Testing
```bash
cd frontend
npm run test
```

## 📱 Mobile Responsiveness

The frontend is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices
- Progressive Web App (PWA) ready

## 🔧 Development Tools

- **Hot Reload**: Both frontend and backend support hot reload
- **Code Formatting**: ESLint for frontend, Maven checkstyle for backend
- **API Testing**: Postman collection available in `/backend/DOCS/`
- **Logging**: Comprehensive logging with different levels

## 🚀 Deployment

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
./mvnw clean package
```

### Environment Variables

Create `.env` files for different environments:

**Backend (application.properties):**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cab_booking
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
jwt.secret=${JWT_SECRET}
```

**Frontend (.env):**
```env
VITE_API_BASE_URL=http://localhost:8081/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Backend Development**: Spring Boot, REST APIs, Database Design
- **Frontend Development**: React, UI/UX, Responsive Design
- **DevOps**: Deployment, CI/CD, Monitoring

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in `/backend/DOCS/`
- Review API examples in `/backend/DOCS/api_endpoints_examples.md`

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
- **v1.1.0** - Added real-time updates and enhanced UI
- **v1.2.0** - Payment integration and rating system
- **v1.3.0** - Mobile responsiveness and PWA features

## 🎯 Roadmap

- [ ] Real-time chat between users and drivers
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Integration with third-party payment gateways
- [ ] Machine learning for dynamic pricing
- [ ] Driver performance analytics
- [ ] Admin dashboard enhancements

---

**Built with ❤️ for efficient and reliable cab booking**
