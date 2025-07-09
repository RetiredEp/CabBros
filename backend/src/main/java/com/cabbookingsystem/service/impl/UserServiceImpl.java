package com.cabbookingsystem.service.impl;

import com.cabbookingsystem.dto.UserLoginRequest;
import com.cabbookingsystem.dto.UserRegisterRequest;
import com.cabbookingsystem.dto.RideHistoryResponse;
import com.cabbookingsystem.entity.User;
import com.cabbookingsystem.entity.Ride;
import com.cabbookingsystem.entity.Payment;
import com.cabbookingsystem.entity.Rating;
import com.cabbookingsystem.enums.Role;
import com.cabbookingsystem.repository.RideRepository;
import com.cabbookingsystem.repository.UserRepository;
import com.cabbookingsystem.repository.PaymentRepository;
import com.cabbookingsystem.repository.RatingRepository;
import com.cabbookingsystem.util.JwtUtil;
import com.cabbookingsystem.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // Automatically injects final fields via constructor
public class UserServiceImpl implements UserService {

    // Dependencies injected via constructor
    private final UserRepository userRepo;
    private final RideRepository rideRepo;
    private final PaymentRepository paymentRepo;
    private final RatingRepository ratingRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /**
     * Registers a new user after validating email uniqueness
     * Hashes password and saves user to database
     */
    @Override
    public String register(UserRegisterRequest request) {
        // Check if email already exists
        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists.");
        }

        // Build new User entity with hashed password
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepo.save(user); // Save user in DB
        return "User registered successfully!";
    }

    /**
     * Authenticates user using email and password
     * Returns a JWT token if credentials are valid
     */
    @Override
    public String login(UserLoginRequest request) {
        // Find user by email
        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email"));

        // Verify password using encoder
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        // Generate JWT token with email and role
        return jwtUtil.generateToken(user.getEmail(), user.getRole());
    }

    /**
     * Retrieves user profile by parsing JWT token
     */
    @Override
    public User getProfile(String token) {
        String email = jwtUtil.extractUsername(token); // Get email from JWT
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Allows a user to book a ride with pickup, drop, fare etc.
     * Sets ride status to REQUESTED and saves it
     */
    @Override
    public Ride bookRide(String token, Ride rideRequest) {
        String email = jwtUtil.extractUsername(token); // Authenticated user
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        rideRequest.setUser(user); // Associate user to ride
        rideRequest.setStatus(com.cabbookingsystem.enums.RideStatus.REQUESTED);
        rideRequest.setDriver(null); // Not assigned yet

        return rideRepo.save(rideRequest);
    }

    /**
     * Returns the user's currently active ride (ACCEPTED or IN_PROGRESS)
     */
    @Override
    public Ride getCurrentRide(String token) {
        String email = jwtUtil.extractUsername(token);
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return rideRepo.findActiveRideByUserId(user.getUserId()) // custom query
                .orElseThrow(() -> new RuntimeException("No active ride found"));
    }

    /**
     * Returns all rides booked by the user — ride history with payment and rating info
     */
    @Override
    public List<RideHistoryResponse> getRideHistory(String token) {
        String email = jwtUtil.extractUsername(token);
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Ride> rides = rideRepo.findByUserUserId(user.getUserId());
        
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
