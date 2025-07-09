# API Documentation: Driver Endpoints

## Driver Register
**Endpoint:**  
`POST http://localhost:8080/api/drivers/register`  

**Content-Type:**  
`application/json`  

**Request Body:**  
```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "licenseNumber": "DL123456789",
  "vehicleDetails": "Toyota Prius, White, 2020",
  "password": "password123"
}
```

**Response:**  
- **Status Code:** `200`  
- **Message:**  
  `Driver registered successfully!`

---

## Driver Login
**Endpoint:**  
`POST http://localhost:8080/api/drivers/login`  

**Content-Type:**  
`application/json`  

**Request Body:**  
```json
{
  "phone": "9876543210",
  "password": "password123"
}
```

**Response:**  
- **Status Code:** `200`  
- **Example Token:**  
  ```plaintext
  eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5ODc2NTQzMjEwIiwicm9sZSI6IkRSSVZFUiIsImlhdCI6MTc0ODk2Mjg4MiwiZXhwIjoxNzQ5MDQ5MjgyfQ.Qcd54SEXsafYZ_F4ElyoldfkawhBBGAeFjPiXy-jRyU
  ```

---

## Get Available Drivers
**Endpoint:**  
`GET http://localhost:8080/api/drivers/available`  

**Headers:**  
`Authorization: Bearer <driver-token>`  

**Response:**  
- **Status Code:** `200`  
- **Example Response Body:**  
  ```json
  [
    {
      "driverId": 1,
      "name": "John Doe",
      "phone": "9876543210",
      "licenseNumber": "DL123456789",
      "vehicleDetails": "Toyota Prius, White, 2020",
      "status": "AVAILABLE"
    },
    {
      "driverId": 2,
      "name": "Jane Smith",
      "phone": "9876543211",
      "licenseNumber": "DL987654321",
      "vehicleDetails": "Honda Civic, Black, 2019",
      "status": "AVAILABLE"
    }
  ]
  ```

---

## Update Driver Status
**Endpoint:**  
`PUT http://localhost:8080/api/drivers/status`  

**Query Parameters:**  
- `available`: `true` or `false`

**Headers:**  
`Authorization: Bearer <driver-token>`  

**Response:**  
- **Status Code:** `200`  
- **Body:**  
  ```json
  {
    "message": "Driver status updated"
  }
  ```

---

## Get Driver Profile
**Endpoint:**  
`GET http://localhost:8080/api/drivers/profile`  

**Headers:**  
`Authorization: Bearer <driver-token>`  

**Response:**  
- **Status Code:** `200`  
- **Example Response Body:**  
  ```json
  {
    "driverId": 1,
    "name": "John Doe",
    "phone": "9876543210",
    "licenseNumber": "DL123456789",
    "vehicleDetails": "Toyota Prius, White, 2020",
    "passwordHash": "$2a$10$bloK2QzSD2pnkbUkw5FUmeudlM21ig9npmNf47a.vRLaJGAnr3ep6",
    "available": true,
    "role": "DRIVER"
  }
  ```