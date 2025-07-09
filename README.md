# CabBros - Cab Booking System

A surprisingly functional full-stack cab booking application built by some bros who know Spring Boot and React.

## 🚀 Project Overview

This is our take on a cab booking system. It actually works! Users can book rides, drivers can accept them, and we even built a payment selection UI (though we won't charge your card). It's got authentication, state management, and everything you'd expect from a demo project that went a bit too far.

## 🏗️ Architecture Overview

### System Design
- **Microservice-ready**: Clear separation between frontend and backend
- **RESTful API**: Stateless communication between client and server
- **JWT Authentication**: Token-based auth for scalability
- **Role-based Access**: User, Driver, and Admin roles with different permissions
- **Real-time Updates**: Polling-based status updates (ready for WebSocket upgrade)

### How It's Built

**Backend (Spring Boot):**
- **Controller Layer**: Handles HTTP requests and responses
- **Service Layer**: Contains business logic and orchestrates operations
- **Repository Layer**: Data access using Spring Data JPA
- **Security Layer**: JWT-based authentication with role-based authorization
- **Configuration**: Centralized config for CORS, security, and database

**Frontend (React):**
- **Component Architecture**: Reusable components with single responsibility
- **Service Layer**: Axios-based API clients with interceptors
- **Route Protection**: Private routes based on authentication state
- **State Management**: React hooks for local state, context for global auth
- **Responsive Design**: CSS Grid and Flexbox with custom CSS variables

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

## 🛠️ How to Build & Understand This Project

### 1. Backend Deep Dive (Spring Boot)

**Core Dependencies:**
```xml
<!-- Key dependencies in pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
</dependency>
```

**Build Process:**
```bash
cd backend

# Clean and compile
./mvnw clean compile

# Run tests
./mvnw test

# Package to JAR
./mvnw clean package

# Run the application
./mvnw spring-boot:run
```

**Key Architecture Components:**

1. **Security Configuration** (`SecurityConfig.java`):
   - JWT token validation
   - Role-based endpoint protection
   - CORS configuration for React frontend

2. **Entity Relationships**:
   - User ↔ Ride (One-to-Many)
   - Driver ↔ Ride (One-to-Many)
   - Ride ↔ Payment (One-to-One)
   - Ride ↔ Rating (One-to-One)

3. **Service Layer Pattern**:
   - `UserService` - User management and authentication
   - `RideService` - Ride booking and status management
   - `DriverService` - Driver operations and availability

### 2. Frontend Deep Dive (React + Vite)

**Build Configuration:**
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true
      }
    }
  }
})
```

**Build Process:**
```bash
cd frontend

# Install dependencies
npm install

# Development server with hot reload
npm run dev

# Type checking and linting
npm run lint

# Production build
npm run build

# Preview production build
npm run preview
```

**Key Frontend Architecture:**

1. **Service Layer** (`src/services/`):
   - `authService.js` - JWT token management, login/logout
   - `rideService.js` - Ride operations API calls
   - `userService.js` - User profile management
   - Response interceptors for token expiration handling

2. **Component Structure**:
   - **Pages**: Full page components with routing
   - **Components**: Reusable UI components
   - **Protected Routes**: Auth-based route protection

3. **Styling System**:
   - CSS Variables for theming (`globals.css`)
   - Responsive grid layouts
   - Unified component classes

### 3. Database Design

**Entity Schema:**
```sql
-- Core entities and relationships
User (id, name, email, phone, password_hash, role)
Driver (id, user_id, license_number, vehicle_info, availability)
Ride (id, user_id, driver_id, pickup, dropoff, status, fare, created_at)
Payment (id, ride_id, amount, method, status)
Rating (id, ride_id, user_rating, driver_rating, comments)
```

**Development Database:**
- H2 in-memory database for quick development
- Auto-creates tables from JPA entities
- Console available at `/h2-console`

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

# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=UserServiceTest

# Generate test coverage report
./mvnw test jacoco:report
```

### Frontend Testing
```bash
cd frontend

# Run tests (when configured)
npm run test

# Lint check
npm run lint

# Build verification
npm run build
```

## 🔧 Development Workflow

### Adding New Features

1. **Backend API Endpoint:**
   ```java
   // 1. Create/update Entity (src/main/java/.../entity/)
   @Entity
   public class NewFeature {
       // JPA annotations and fields
   }
   
   // 2. Create Repository (src/main/java/.../repository/)
   public interface NewFeatureRepository extends JpaRepository<NewFeature, Long> {}
   
   // 3. Create Service (src/main/java/.../service/)
   @Service
   public class NewFeatureService {
       // Business logic
   }
   
   // 4. Create Controller (src/main/java/.../controller/)
   @RestController
   @RequestMapping("/api/new-feature")
   public class NewFeatureController {
       // REST endpoints
   }
   ```

2. **Frontend Integration:**
   ```javascript
   // 1. Add service function (src/services/)
   export const newFeatureService = {
     async getAll() {
       const response = await api.get('/new-feature');
       return response.data;
     }
   };
   
   // 2. Create/update component (src/pages/ or src/components/)
   export default function NewFeaturePage() {
     // React component logic
   }
   
   // 3. Add route (src/routes/AppRouter.jsx)
   <Route path="/new-feature" element={<NewFeaturePage />} />
   ```

### Common Development Tasks

**Hot Reload Setup:**
```bash
# Terminal 1: Backend with auto-restart
cd backend && ./mvnw spring-boot:run

# Terminal 2: Frontend with hot module replacement
cd frontend && npm run dev
```

**Database Changes:**
```bash
# Check H2 console: http://localhost:8081/h2-console
# JDBC URL: jdbc:h2:mem:testdb
# Username: sa, Password: (empty)
```

**API Testing:**
```bash
# Use provided Postman collection
# Import: backend/DOCS/cab-booking-postman-collection.json
# Environment: backend/DOCS/cab-booking-postman-environment.json
```

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start:**
   ```bash
   # Check Java version
   java -version  # Should be 17+
   
   # Check port availability
   netstat -an | grep 8081
   
   # Clean and rebuild
   ./mvnw clean install
   ```

2. **Frontend build fails:**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   
   # Check Node version
   node -v  # Should be 16+
   ```

3. **CORS Issues:**
   - Backend CORS is configured for `http://localhost:5173`
   - Frontend proxy is configured for `/api` routes
   - Check `SecurityConfig.java` for CORS settings

4. **Authentication Issues:**
   - JWT tokens expire after configured time
   - Check browser localStorage for token
   - Interceptor handles token refresh automatically

### Debugging Tips

**Backend Debugging:**
```bash
# Enable debug logging in application.properties
logging.level.com.cabbookingsystem=DEBUG
logging.level.org.springframework.security=DEBUG

# Run with debugger
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

**Frontend Debugging:**
```javascript
// Check API calls in browser dev tools
// Add console.logs in service functions
// Use React DevTools browser extension
```
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

- **v1.4.0** (Current) - Rebranded to CabBros with humorous but honest copy
- **v1.3.0** - Enhanced error handling, token management, and UI consistency  
- **v1.2.0** - Payment method selection, driver availability improvements
- **v1.1.0** - Global theming system, standardized UI components
- **v1.0.0** - Initial release with core functionality

## 🚀 Production Deployment

### Docker Support (Optional)

**Backend Dockerfile:**
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/cab-booking-system-1.0.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

### Environment Setup

**Production application.properties:**
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/cabros_prod
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}

# JPA
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# Security
jwt.secret=${JWT_SECRET_PROD}
jwt.expiration=86400000

# Logging
logging.level.root=INFO
logging.file.name=logs/cabros.log
```

**Production .env (Frontend):**
```env
VITE_API_BASE_URL=https://api.cabros.com/api
VITE_ENVIRONMENT=production
```

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
