package com.cabbookingsystem.controller;

import com.cabbookingsystem.dto.UserLoginRequest;
import com.cabbookingsystem.dto.UserRegisterRequest;
import com.cabbookingsystem.dto.RideHistoryResponse;
import com.cabbookingsystem.entity.User;
import com.cabbookingsystem.entity.Ride;
import com.cabbookingsystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow frontend calls
public class UserController {

    private final UserService userService;

    /**
     * User registration
     */
    @PostMapping("/register")
    public String register(@RequestBody UserRegisterRequest request) {
        return userService.register(request);
    }

    /**
     * User login (returns JWT)
     */
    @PostMapping("/login")
    public String login(@RequestBody UserLoginRequest request) {
        return userService.login(request);
    }

    /**
     * Get authenticated user's profile
     */
    @GetMapping("/profile")
    public User getProfile(@RequestHeader("Authorization") String token) {
        return userService.getProfile(stripToken(token));
    }

    /**
     * Book a ride (pickup/drop + fare/distance comes from frontend)
     */
    @PostMapping("/book")
    public Ride bookRide(@RequestHeader("Authorization") String token, @RequestBody Ride rideRequest) {
        return userService.bookRide(stripToken(token), rideRequest);
    }

    /**
     * Get current active ride (ACCEPTED/IN_PROGRESS)
     */
    @GetMapping("/ride/current")
    public ResponseEntity<Ride> getCurrentRide(@RequestHeader("Authorization") String token) {
        try {
            Ride currentRide = userService.getCurrentRide(stripToken(token));
            return ResponseEntity.ok(currentRide);
        } catch (RuntimeException e) {
            if (e.getMessage().equals("No active ride found")) {
                return ResponseEntity.notFound().build(); // 404 instead of 500
            }
            throw e; // Re-throw other exceptions
        }
    }

    /**
     * Get all rides booked by user (ride history)
     */
    @GetMapping("/ride/history")
    public List<RideHistoryResponse> getRideHistory(@RequestHeader("Authorization") String token) {
        return userService.getRideHistory(stripToken(token));
    }

    /**
     * Utility: Removes "Bearer " prefix from token
     */
    private String stripToken(String token) {
        return token.startsWith("Bearer ") ? token.substring(7) : token;
    }
}
