# Cab Booking System API Endpoints & Examples

This document lists all backend API endpoints, their HTTP methods, exact JSON request/response examples, and descriptions.

---

## User Endpoints

### 1. Register User
- **Frontend Usage:** Use this when a new user signs up. Call this from the registration form. No token required.
- **POST** `/api/users/register`
- **Request:**
  ```json
  {
    "name": "Alice",
    "email": "alice@example.com",
    "phone": "1234567890",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  "User registered successfully"
  ```

---

### 2. User Login
- **Frontend Usage:** Use this when a user logs in. Call this from the login form. No token required. Store the returned JWT for authenticated requests.
- **POST** `/api/users/login`
- **Request:**
  ```json
  {
    "email": "alice@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  ```

---

### 3. Get User Profile
- **Frontend Usage:** Use this to fetch the logged-in user's profile after login or on profile page load. Requires JWT token in Authorization header.
- **GET** `/api/users/profile`
- **Header:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "userId": 1,
    "name": "Alice",
    "email": "alice@example.com",
    "phone": "1234567890",
    "passwordHash": "$2a$10$...",
    "role": "USER"
  }
  ```

---

### 4. Book a Ride
- **Frontend Usage:** Use this when a user books a ride from the booking form. Requires JWT token.
- **POST** `/api/users/book`
- **Header:** `Authorization: Bearer <token>`
- **Request:**
  ```json
  {
    "pickupLocation": "123 Main St",
    "dropoffLocation": "456 Elm St",
    "fare": 250.0,
    "distance": 12.5,
    "status": "REQUESTED"
  }
  ```
- **Response:**
  ```json
  {
    "rideId": 101,
    "user": { "userId": 1, "name": "Alice", ... },
    "driver": null,
    "pickupLocation": "123 Main St",
    "dropoffLocation": "456 Elm St",
    "fare": 250.0,
    "distance": 12.5,
    "status": "REQUESTED"
  }
  ```

---

### 5. Get Current Ride
- **Frontend Usage:** Use this to show the user's current ride status (e.g., in-progress or accepted) on the dashboard. Requires JWT token.
- **GET** `/api/users/ride/current`
- **Header:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "rideId": 101,
    "user": { "userId": 1, "name": "Alice", ... },
    "driver": { "driverId": 2, "name": "Bob", ... },
    "pickupLocation": "123 Main St",
    "dropoffLocation": "456 Elm St",
    "fare": 250.0,
    "distance": 12.5,
    "status": "IN_PROGRESS"
  }
  ```

---

### 6. Get Ride History
- **Frontend Usage:** Use this to display the user's past rides (ride history page). Requires JWT token.
- **GET** `/api/users/ride/history`
- **Header:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  [
    {
      "rideId": 101,
      "user": { "userId": 1, "name": "Alice", ... },
      "driver": { "driverId": 2, "name": "Bob", ... },
      "pickupLocation": "123 Main St",
      "dropoffLocation": "456 Elm St",
      "fare": 250.0,
      "distance": 12.5,
      "status": "COMPLETED"
    }
  ]
  ```

---

## Driver Endpoints

### 1. Register Driver
- **Frontend Usage:** Use this when a new driver signs up. Call this from the driver registration form. No token required.
- **POST** `/api/drivers/register`
- **Request:**
  ```json
  {
    "name": "Bob",
    "email": "bob@example.com",
    "phone": "9876543210",
    "password": "driverpass",
    "licenseNumber": "DL123456",
    "vehicleDetails": "Toyota Prius 2018"
  }
  ```
- **Response:**
  ```json
  "Driver registered successfully"
  ```

---

### 2. Driver Login
- **Frontend Usage:** Use this when a driver logs in. Call this from the driver login form. No token required. Store the returned JWT for authenticated requests.
- **POST** `/api/drivers/login`
- **Request:**
  ```json
  {
    "email": "bob@example.com",
    "password": "driverpass"
  }
  ```
- **Response:**
  ```json
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  ```

---

### 3. Get Driver Profile
- **Frontend Usage:** Use this to fetch the logged-in driver's profile after login or on profile page load. Requires JWT token in Authorization header.
- **GET** `/api/drivers/profile`
- **Header:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "driverId": 2,
    "name": "Bob",
    "email": "bob@example.com",
    "phone": "9876543210",
    "passwordHash": "$2a$10$...",
    "licenseNumber": "DL123456",
    "vehicleDetails": "Toyota Prius 2018",
    "available": true,
    "role": "DRIVER"
  }
  ```

---

### 4. Update Availability
- **Frontend Usage:** Use this when a driver toggles their online/offline status in the app. Requires JWT token. Use `available=true` to go online, `available=false` to go offline.
- **POST** `/api/drivers/availability?available=true`
- **Header:** `Authorization: Bearer <token>`
- **Response:**
  (No content, HTTP 200)

---

### 5. Get Available Ride Requests
- **Frontend Usage:** Use this to show drivers a list of unassigned ride requests they can accept. Requires JWT token.
- **GET** `/api/drivers/rides/requests`
- **Response:**
  ```json
  [
    {
      "rideId": 101,
      "user": { "userId": 1, "name": "Alice", ... },
      "driver": null,
      "pickupLocation": "123 Main St",
      "dropoffLocation": "456 Elm St",
      "fare": 250.0,
      "distance": 12.5,
      "status": "REQUESTED"
    }
  ]
  ```

---

### 6. Accept Ride
- **Frontend Usage:** Use this when a driver accepts a ride from the available requests list. Requires JWT token. Pass the rideId as a query parameter.
- **POST** `/api/drivers/rides/accept?rideId=101`
- **Header:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "rideId": 101,
    "user": { "userId": 1, "name": "Alice", ... },
    "driver": { "driverId": 2, "name": "Bob", ... },
    "pickupLocation": "123 Main St",
    "dropoffLocation": "456 Elm St",
    "fare": 250.0,
    "distance": 12.5,
    "status": "ACCEPTED"
  }
  ```

---

### 7. Update Ride Status
- **Frontend Usage:** Use this when a driver marks a ride as started (`IN_PROGRESS`) or completed (`COMPLETED`). Requires JWT token. Pass the new status as a query parameter.
- **POST** `/api/drivers/rides/status?status=IN_PROGRESS`
- **Header:** `Authorization: Bearer <token>`
- **Response:**
  (No content, HTTP 200)

---

### 8. Get Current Ride
- **Frontend Usage:** Use this to show the driver's current ride (accepted or in-progress) on their dashboard. Requires JWT token.
- **GET** `/api/drivers/rides/current`
- **Header:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "rideId": 101,
    "user": { "userId": 1, "name": "Alice", ... },
    "driver": { "driverId": 2, "name": "Bob", ... },
    "pickupLocation": "123 Main St",
    "dropoffLocation": "456 Elm St",
    "fare": 250.0,
    "distance": 12.5,
    "status": "IN_PROGRESS"
  }
  ```

---

### 9. Get Ride History
- **Frontend Usage:** Use this to display the driver's completed rides (ride history page). Requires JWT token.
- **GET** `/api/drivers/rides/history`
- **Header:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  [
    {
      "rideId": 101,
      "user": { "userId": 1, "name": "Alice", ... },
      "driver": { "driverId": 2, "name": "Bob", ... },
      "pickupLocation": "123 Main St",
      "dropoffLocation": "456 Elm St",
      "fare": 250.0,
      "distance": 12.5,
      "status": "COMPLETED"
    }
  ]
  ```

---

## Ride Endpoints

### 1. Get Ride by ID
- **Frontend Usage:** Use this to fetch ride details by rideId (e.g., for payment or rating screens). Requires JWT token if user/driver is not admin.
- **GET** `/api/rides/{rideId}`
- **Response:**
  ```json
  {
    "rideId": 101,
    "user": { "userId": 1, "name": "Alice", ... },
    "driver": { "driverId": 2, "name": "Bob", ... },
    "pickupLocation": "123 Main St",
    "dropoffLocation": "456 Elm St",
    "fare": 250.0,
    "distance": 12.5,
    "status": "COMPLETED"
  }
  ```

---

### 2. Update Ride Status (Admin/Debug)
- **Frontend Usage:** For admin or debugging tools only. Allows manual status update of a ride. Not used in normal frontend flow.
- **POST** `/api/rides/{rideId}/status?status=COMPLETED`
- **Response:**
  (No content, HTTP 200)

---

## Payment Endpoints

### 1. Process Payment
- **Frontend Usage:** Use this after ride completion to process payment. Call from the payment screen. Requires JWT token.
- **POST** `/api/payment/pay`
- **Request:**
  ```json
  {
    "rideId": 101,
    "amount": 250.0,
    "method": "CASH"
  }
  ```
- **Response:**
  ```json
  {
    "paymentId": 1,
    "ride": { "rideId": 101, ... },
    "amount": 250.0,
    "method": "CASH",
    "status": "SUCCESS",
    "timestamp": "2024-07-09T12:34:56"
  }
  ```

---

### 2. Get Payment Receipt
- **Frontend Usage:** Use this to show the payment receipt after a successful payment. Requires JWT token.
- **GET** `/api/payment/receipt/{rideId}`
- **Response:**
  ```json
  {
    "paymentId": 1,
    "ride": { "rideId": 101, ... },
    "amount": 250.0,
    "method": "CASH",
    "status": "SUCCESS",
    "timestamp": "2024-07-09T12:34:56"
  }
  ```

---

## Rating Endpoints

### 1. Submit Rating
- **Frontend Usage:** Use this after ride completion to submit a rating. Call from the rating screen. Requires JWT token.
- **POST** `/api/ratings/submit`
- **Request:**
  ```json
  {
    "rideId": 101,
    "score": 5,
    "comment": "Great ride!"
  }
  ```
- **Response:**
  ```json
  {
    "ratingId": 1,
    "ride": { "rideId": 101, ... },
    "score": 5,
    "comment": "Great ride!"
  }
  ```

---

### 2. Get Ratings for Driver
- **Frontend Usage:** Use this to show a driver's ratings (e.g., in their dashboard or profile). Requires JWT token if not public.
- **GET** `/api/ratings/driver/{driverId}`
- **Response:**
  ```json
  [
    {
      "ratingId": 1,
      "ride": { "rideId": 101, ... },
      "score": 5,
      "comment": "Great ride!"
    }
  ]
  ```

---

**Note:**
- Replace `{ ...user object... }`, `{ ...driver object... }`, `{ ...ride object... }` with the actual JSON structure as shown above.
- Enum fields like `"status"`, `"method"`, `"role"` must use the allowed values as defined in your enums. 