# Rating API Documentation

## POST /api/ratings

### Description
Submit a rating for a completed ride.

### Request
**URL:** `http://localhost:8080/api/ratings`  
**Method:** POST  
**Headers:**  
`Authorization: Bearer <user-token>`  

**Body:**
```json
{
  "rideId": 2,
  "score": 5,
  "comments": "Great ride! Very professional driver."
}
```

### Response
**Status Code:** 200 OK  
**Body:**
```json
{
  "ratingId": 1,
  "ride": {
    "rideId": 2,
    "user": {
      "userId": 2,
      "name": "Manjiri",
      "email": "manjiri@gmail.com",
      "phone": "9876543210",
      "role": "USER",
      "createdAt": "2025-06-19T09:33:43.869294700"
    },
    "driver": {
      "driverId": 1,
      "name": "Ram",
      "phone": "9845627745",
      "licenseNumber": "DL12345456",
      "vehicleDetails": "BenZ, White, 2020",
      "available": true,
      "role": "DRIVER"
    },
    "pickupLocation": "CDC cognizant",
    "dropoffLocation": "Metro Food Court",
    "fare": 180.55,
    "status": "COMPLETED"
  },
  "fromUserId": 2,
  "toUserId": 1,
  "score": 5,
  "comments": "Great ride! Very professional driver."
}
```

---

## GET /api/ratings/driver/ratings

### Description
Retrieve all ratings received by a driver.

### Request
**URL:** `http://localhost:8080/api/ratings/driver/ratings`  
**Method:** GET  
**Headers:**  
`Authorization: Bearer <driver-token>`  

### Response
**Status Code:** 200 OK  
**Body:**
```json
[
  {
    "ratingId": 1,
    "ride": {
      "rideId": 2,
      "user": {
        "userId": 2,
        "name": "Manjiri",
        "email": "manjiri@gmail.com",
        "phone": "9876543210",
        "role": "USER",
        "createdAt": "2025-06-19T09:33:43.869294700"
      },
      "driver": {
        "driverId": 1,
        "name": "Ram",
        "phone": "9845627745",
        "licenseNumber": "DL12345456",
        "vehicleDetails": "BenZ, White, 2020",
        "available": true,
        "role": "DRIVER"
      },
      "pickupLocation": "CDC cognizant",
      "dropoffLocation": "Metro Food Court",
      "fare": 180.55,
      "status": "COMPLETED"
    },
    "fromUserId": 2,
    "toUserId": 1,
    "score": 5,
    "comments": "Great ride! Very professional driver."
  }
]
```