package com.cabbookingsystem.service.impl;

import com.cabbookingsystem.dto.DriverLoginRequest;
import com.cabbookingsystem.dto.DriverRegisterRequest;
import com.cabbookingsystem.dto.RideHistoryResponse;
import com.cabbookingsystem.entity.Driver;
import com.cabbookingsystem.entity.Ride;
import com.cabbookingsystem.entity.Payment;
import com.cabbookingsystem.entity.Rating;
import com.cabbookingsystem.enums.RideStatus;
import com.cabbookingsystem.enums.Role;
import com.cabbookingsystem.repository.DriverRepository;
import com.cabbookingsystem.repository.RideRepository;
import com.cabbookingsystem.repository.PaymentRepository;
import com.cabbookingsystem.repository.RatingRepository;
import com.cabbookingsystem.util.JwtUtil;
import com.cabbookingsystem.service.DriverService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepo;
    private final RideRepository rideRepo;
    private final PaymentRepository paymentRepo;
    private final RatingRepository ratingRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /**
     * Registers a new driver after checking email uniqueness
     * Hashes password and stores the driver with role = DRIVER
     */
    @Override
    public String register(DriverRegisterRequest request) {
        if (driverRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists.");
        }

        Driver driver = Driver.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .licenseNumber(request.getLicenseNumber())
                .vehicleDetails(request.getVehicleDetails())
                .available(false) // default to offline
                .role(Role.DRIVER)
                .build();

        driverRepo.save(driver);
        return "Driver registered successfully!";
    }

    /**
     * Authenticates driver using email and password
     * Returns a JWT token with driver role
     */
    @Override
    public String login(DriverLoginRequest request) {
        Driver driver = driverRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email"));

        if (!passwordEncoder.matches(request.getPassword(), driver.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtil.generateToken(driver.getEmail(), driver.getRole());
    }

    /**
     * Returns driver's profile using JWT token
     */
    @Override
    public Driver getProfile(String token) {
        String email = jwtUtil.extractEmail(token);
        return driverRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
    }

    /**
     * Updates driver's availability status (online/offline)
     * Triggered by toggle in dashboard
     */
    @Override
    public void updateAvailability(String token, boolean available) {
        String email = jwtUtil.extractEmail(token);
        Driver driver = driverRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        driver.setAvailable(available);
        driverRepo.save(driver);
    }

    /**
     * Returns all ride requests with status = REQUESTED and not yet assigned
     * These are broadcasted rides for available drivers to see
     */
    @Override
    public List<Ride> getAvailableRideRequests() {
        return rideRepo.findUnassignedRideRequests();
    }

    /**
     * Accepts a ride if it is still unassigned
     * Assigns current driver to the ride, updates status to ACCEPTED
     * Other drivers won’t see this ride anymore
     */
    @Override
    public Ride acceptRide(String token, Long rideId) {
        String email = jwtUtil.extractEmail(token);
        Driver driver = driverRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        // Only allow accepting if the ride is not already taken
        Ride ride = rideRepo.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (ride.getDriver() != null || ride.getStatus() != RideStatus.REQUESTED) {
            throw new RuntimeException("Ride already accepted by another driver.");
        }

        ride.setDriver(driver);
        ride.setStatus(RideStatus.ACCEPTED);
        return rideRepo.save(ride);
    }

    /**
     * Returns current ride for driver (ACCEPTED or IN_PROGRESS)
     * Used for tracking and status update
     */
    @Override
    public Ride getCurrentRide(String token) {
        String email = jwtUtil.extractEmail(token);
        Driver driver = driverRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        return rideRepo.findActiveRideByDriverId(driver.getDriverId())
                .orElseThrow(() -> new RuntimeException("No active ride found"));
    }

    /**
     * Updates status of the current ride (e.g. IN_PROGRESS or COMPLETED)
     * Called by driver when they start or finish the ride
     */
    @Override
    public void updateRideStatus(String token, String status) {
        String email = jwtUtil.extractEmail(token);
        Driver driver = driverRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        Ride ride = rideRepo.findActiveRideByDriverId(driver.getDriverId())
                .orElseThrow(() -> new RuntimeException("No active ride"));

        ride.setStatus(RideStatus.valueOf(status.toUpperCase()));
        rideRepo.save(ride);
    }

    /**
     * Fetches all completed rides for driver — ride history with payment and rating info
     */
    @Override
    public List<RideHistoryResponse> getRideHistory(String token) {
        String email = jwtUtil.extractEmail(token);
        Driver driver = driverRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        List<Ride> rides = rideRepo.findByDriverDriverId(driver.getDriverId());
        
        return rides.stream().map(ride -> {
            // Get payment info
            Payment payment = paymentRepo.findByRideRideId(ride.getRideId());
            
            // Get rating info
            Rating rating = ratingRepo.findByRideRideId(ride.getRideId());
            
            return RideHistoryResponse.builder()
                    .rideId(ride.getRideId())
                    .user(ride.getUser())
                    .driver(ride.getDriver())
                    .pickupLocation(ride.getPickupLocation())
                    .dropoffLocation(ride.getDropoffLocation())
                    .fare(ride.getFare())
                    .distance(ride.getDistance())
                    .status(ride.getStatus())
                    .createdAt(ride.getCreatedAt())
                    .updatedAt(ride.getUpdatedAt())
                    .paymentMethod(payment != null ? payment.getMethod() : null)
                    .paymentStatus(payment != null ? payment.getStatus() : "Not Paid")
                    .paymentTimestamp(payment != null ? payment.getTimestamp() : null)
                    .ratingScore(rating != null ? rating.getScore() : null)
                    .ratingComment(rating != null ? rating.getComment() : null)
                    .build();
        }).collect(Collectors.toList());
    }
}
