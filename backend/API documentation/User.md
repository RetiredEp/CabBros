# API Documentation: User Endpoints

## User Register
**Endpoint:**  
`POST http://localhost:8080/api/users/register`  

**Content-Type:**  
`application/json`  

**Request Body:**  
```json
{
  "name": "Srujan G S",
  "email": "srujan@gmail.com",
  "phone": "9148147745",
  "password": "srujan123"
}
```

**Response:**  
**Status Code:** `200`  
**Message:**  
`User registered successfully!`

---

## User Login
**Endpoint:**  
`POST http://localhost:8080/api/users/login`  

**Content-Type:**  
```json
{
  "email": "srujan@gmail.com",
  "password": "srujan123"
}
```

**Response:**  
**Status Code:** `200`  
**Example Token:**  
```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzcnVqYW5AZ21haWwuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3NDg5NjI4ODIsImV4cCI6MTc0OTA0OTI4Mn0.Qcd54SEXsafYZ_F4ElyoldfkawhBBGAeFjPiXy-jRyU
```

---

## User Profile
**Endpoint:**  
`GET http://localhost:8080/api/users/profile`  

**Headers:**  
`Authorization: Bearer <user-token>`  

**Response:**  
**Status Code:** `200`  
**Example Response Body:**  
```json
{
  "userId": 1,
  "name": "Srujan G S",
  "email": "srujan@gmail.com",
  "phone": "9148147745",
  "passwordHash": "$2a$10$1VqTgnz0Qh70Q/uscI/YkuKa355VAuRLRYr9RpTtFTLBIzE4AvJkC",
  "role": "USER",
  "createdAt": "2025-06-03T20:27:03.414282400"
}
```


