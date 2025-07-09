# API Documentation: Payment Endpoints

## Process Payment

### Endpoint
`POST http://localhost:8080/api/payments/process`

### Headers
- `Authorization: Bearer <user-token>`  
- `Content-Type: application/json`

### Request Body
```json
{
  "rideId": 2,
  "amount": 228.0,
  "method": "CARD"
}
```

### Response
**Status Code:** 200  
**Example Response Body:**
```json
{
  "paymentId": 1,
  "ride": {
    "rideId": 2,
    "user": {
      "userId": 2,
      "name": "Manjiri",
      "email": "manjiri@gmail.com",
      "phone": "9876543210",
      "passwordHash": "$2a$10$L3gS.D4NUzg3fuR69zc.qeoCeBp7R/PHU6RE.t5P1egaoGsbVJxQi",
      "role": "USER",
      "createdAt": "2025-06-19T09:33:43.869294700"
    },
    "driver": {
      "driverId": 1,
      "name": "Ram",
      "phone": "9845627745",
      "licenseNumber": "DL12345456",
      "vehicleDetails": "BenZ, White, 2020",
      "passwordHash": "$2a$10$u0Hbe3Na/wRtgIk79brTF.CNTsJi8fdNCTHP00BvsCEYhDbXPlJr2",
      "available": true,
      "role": "DRIVER"
    },
    "pickupLocation": "CDC cognizant",
    "dropoffLocation": "Metro Food Court",
    "fare": 180.5476086416629,
    "status": "COMPLETED"
  },
  "user": {
    "userId": 2,
    "name": "Manjiri",
    "email": "manjiri@gmail.com",
    "phone": "9876543210",
    "passwordHash": "$2a$10$L3gS.D4NUzg3fuR69zc.qeoCeBp7R/PHU6RE.t5P1egaoGsbVJxQi",
      "role": "USER",
      "createdAt": "2025-06-19T09:33:43.869294700"
  },
  "amount": 228.0,
  "method": "CARD",
  "status": "SUCCESS",
  "timestamp": "2025-06-19T10:17:51.013602100"
}
```

---

## Get Receipt

### Endpoint
`GET http://localhost:8080/api/payments/receipt/{rideId}`

### Headers
- `Authorization: Bearer <user-token>`

### Path Parameter
- `rideId`: The ID of the ride for which the receipt is requested.

### Response
**Status Code:** 200  
**Example Response Body:**
```json
{
  "paymentId": 1,
  "ride": {
    "rideId": 2,
    "user": {
      "userId": 2,
      "name": "Manjiri",
      "email": "manjiri@gmail.com",
      "phone": "9876543210",
      "passwordHash": "$2a$10$L3gS.D4NUzg3fuR69zc.qeoCeBp7R/PHU6RE.t5P1egaoGsbVJxQi",
      "role": "USER",
      "createdAt": "2025-06-19T09:33:43.869294700"
    },
    "driver": {
      "driverId": 1,
      "name": "Ram",
      "phone": "9845627745",
      "licenseNumber": "DL12345456",
      "vehicleDetails": "BenZ, White, 2020",
      "passwordHash": "$2a$10$u0Hbe3Na/wRtgIk79brTF.CNTsJi8fdNCTHP00BvsCEYhDbXPlJr2",
      "available": true,
      "role": "DRIVER"
    },
    "pickupLocation": "CDC cognizant",
    "dropoffLocation": "Metro Food Court",
    "fare": 180.5476086416629,
    "status": "COMPLETED"
  },
  "user": {
    "userId": 2,
    "name": "Manjiri",
    "email": "manjiri@gmail.com",
    "phone": "9876543210",
    "passwordHash": "$2a$10$L3gS.D4NUzg3fuR69zc.qeoCeBp7R/PHU6RE.t5P1egaoGsbVJxQi",
    "role": "USER",
    "createdAt": "2025-06-19T09:33:43.869294700"
  },
  "amount": 228.0,
  "method": "CARD",
  "status": "SUCCESS",
  "timestamp": "2025-06-19T10:17:51.013602100"
}
```