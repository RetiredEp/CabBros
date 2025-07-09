// ✅ Vite + React frontend architecture for CabBros (Cab Booking System)

// Pages Overview:

src/
├── App.jsx
├── main.jsx
├── router.jsx
├── assets/           // logos, icons
├── api/              // axios API calls
│   ├── auth.js
│   ├── user.js
│   └── driver.js
├── components/
│   ├── RoleSwitchForm.jsx
│   ├── ProtectedRoute.jsx
│   └── ProfilePopup.jsx
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── RegisterPage.jsx
│   ├── LoginPage.jsx
│   ├── User/
│   │   ├── BookingPage.jsx
│   │   ├── CurrentRidePage.jsx
│   │   ├── PaymentReceiptPage.jsx
│   │   └── UserProfilePage.jsx
│   └── Driver/
│       ├── AvailabilityPage.jsx
│       ├── AvailableRidesPage.jsx
│       ├── DriverRidePage.jsx
│       └── DriverProfilePage.jsx

// 1️⃣ Home Page (HomePage.jsx)
// - Show CabBros logo
// - Description about the project architecture
// - Two buttons: "Register" and "Login"

// 2️⃣ Auth Pages
// ✅ RegisterPage.jsx
// - Dropdown to choose "User" or "Driver"
// - Dynamically render relevant registration form
// - Form validation using regex and error handling

// ✅ LoginPage.jsx
// - Dropdown to select role
// - Validate login fields
// - POST to /api/users/login or /api/drivers/login based on role

// 3️⃣ Role-Based Dashboards

// 🔵 For User:
// - BookingPage.jsx:
//   - Leaflet search (pickup, drop)
//   - Calculate distance + duration using Leaflet or external API
//   - Show booking estimate
//   - Book button sends booking data to backend
//   - Show "Searching for Driver..." screen
// - CurrentRidePage.jsx:
//   - Show ride + driver info
//   - On completion: show payment button
//   - On payment: display PaymentReceiptPage.jsx
//   - Then: show rating form
// - UserProfilePage.jsx:
//   - Show user details
//   - List ride history

// 🔴 For Driver:
// - AvailabilityPage.jsx:
//   - Toggle availability (send to backend)
// - AvailableRidesPage.jsx:
//   - List rides
//   - Accept button -> set availability false, redirect to DriverRidePage.jsx
// - DriverRidePage.jsx:
//   - Overview map with pickup and drop markers
//   - Start ride -> Complete ride
// - DriverProfilePage.jsx:
//   - Show driver info and ride history

// Shared components:
// - ProfilePopup.jsx (for user/driver top-right corner menu)
// - RoleSwitchForm.jsx (dropdown-based form switcher)

// Routes:
<Route path="/" element={<HomePage />} />
<Route path="/register" element={<RegisterPage />} />
<Route path="/login" element={<LoginPage />} />
<Route path="/user/booking" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
<Route path="/user/current" element={<CurrentRidePage />} />
<Route path="/user/receipt" element={<PaymentReceiptPage />} />
<Route path="/user/profile" element={<UserProfilePage />} />
<Route path="/driver/availability" element={<AvailabilityPage />} />
<Route path="/driver/rides" element={<AvailableRidesPage />} />
<Route path="/driver/ride" element={<DriverRidePage />} />
<Route path="/driver/profile" element={<DriverProfilePage />} />
