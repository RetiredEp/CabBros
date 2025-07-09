# API Documentation: Ride Endpoints

## Book a Ride
**Endpoint:**  
`POST http://localhost:8080/api/rides/book`  

**Content-Type:**  
`application/json`  

**Headers:**  
`Authorization: Bearer <user-token>`  

**Request Body:**  
```json
{
  "pickupLocation": "123 Main Street",
  "dropoffLocation": "456 Elm Street"
}
```

**Response:**  
- **Status Code:** `200`  
- **Example Response Body:**  
  ```json
  

  "rideId": 2,

  "user": {

    "userId": 1,

    "name": "Srujan G S",

    "email": "srujan@gmail.com",

    "phone": "9148147745",

    "passwordHash": "$2a$10$wKQmqNLVkW8C0GMR/XyCAe9KyKdsiGuv.zGhrTQsGfj5wb/0X6r7u",

    "role": "USER",

    "createdAt": "2025-06-19T10:46:00.057796800"

  },

  "driver": {

    "driverId": 1,

    "name": "John Doe",

    "phone": "9876543210",

    "licenseNumber": "DL123456789",

    "vehicleDetails": "Toyota Prius, White, 2020",

    "passwordHash": "$2a$10$7TuyME2DYNlTkK56Onr3BesK.VpDXmS6owcY2Vc5UmG/DfsCQFwV6",

    "available": false,

    "role": "DRIVER"

  },

  "pickupLocation": "Cognizant CDC",

  "dropoffLocation": "Metro Food court",

  "fare": 139.8553756666655,

  "status": "REQUESTED"


 
  ```

---

## Update Ride Status
**Endpoint:**  
`PUT http://localhost:8080/api/rides/status`  

**Query Parameters:**  
- `status`: `REQUESTED`, `ASSIGNED`, `ONGOING`, `COMPLETED`, `CANCELLED`, `IN_PROGRESS`

**Headers:**  
`Authorization: Bearer <driver-token>`  

**Response:**  
- **Status Code:** `200`  
- **Body:**  
  ```json
  {
    "message": "Ride status updated"
  }
  ```

---

## Get User Rides
**Endpoint:**  
`GET http://localhost:8080/api/rides/user/rides`  

**Headers:**  
`Authorization: Bearer <user-token>`  

**Response:**  
- **Status Code:** `200`  
- **Example Response Body:**  
  ```json
  

  {
    "rideId": 1,
    "user": {
      "userId": 1,
      "name": "Srujan G S",
      "email": "srujan@gmail.com",
      "phone": "9148147745",
      "passwordHash": "$2a$10$wKQmqNLVkW8C0GMR/XyCAe9KyKdsiGuv.zGhrTQsGfj5wb/0X6r7u",
      "role": "USER",
      "createdAt": "2025-06-19T10:46:00.057796800"
    },
    "driver": {
      "driverId": 1,
      "name": "John Doe",
      "phone": "9876543210",
      "licenseNumber": "DL123456789",
      "vehicleDetails": "Toyota Prius, White, 2020",
      "passwordHash": "$2a$10$7TuyME2DYNlTkK56Onr3BesK.VpDXmS6owcY2Vc5UmG/DfsCQFwV6",
      "available": false,
      "role": "DRIVER"
    },
    "pickupLocation": "Cognizant CDC",
    "dropoffLocation": "Metro Food court",
    "fare": 236.3462644620552,
    "status": "COMPLETED"
  },
  {
    "rideId": 2,
    "user": {
      "userId": 1,
      "name": "Srujan G S",
      "email": "srujan@gmail.com",
      "phone": "9148147745",
      "passwordHash": "$2a$10$wKQmqNLVkW8C0GMR/XyCAe9KyKdsiGuv.zGhrTQsGfj5wb/0X6r7u",
      "role": "USER",
      "createdAt": "2025-06-19T10:46:00.057796800"
    },
    "driver": {
      "driverId": 1,
      "name": "John Doe",
      "phone": "9876543210",
      "licenseNumber": "DL123456789",
      "vehicleDetails": "Toyota Prius, White, 2020",
      "passwordHash": "$2a$10$7TuyME2DYNlTkK56Onr3BesK.VpDXmS6owcY2Vc5UmG/DfsCQFwV6",
      "available": false,
      "role": "DRIVER"
    },
    "pickupLocation": "Cognizant CDC",
    "dropoffLocation": "Metro Food court",
    "fare": 139.8553756666655,
    "status": "REQUESTED"
  }

  ```