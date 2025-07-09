package com.cabbookingsystem.controller;

import com.cabbookingsystem.dto.DriverLoginRequest;
import com.cabbookingsystem.dto.DriverRegisterRequest;
import com.cabbookingsystem.dto.RideHistoryResponse;
import com.cabbookingsystem.entity.Driver;
import com.cabbookingsystem.entity.Ride;
import com.cabbookingsystem.service.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DriverService driverService;

    /**
     * Driver registration
     */
    @PostMapping("/register")
    public String register(@RequestBody DriverRegisterRequest request) {
        return driverService.register(request);
    }

    /**
     * Driver login (returns JWT)
     */
    @PostMapping("/login")
    public String login(@RequestBody DriverLoginRequest request) {
        return driverService.login(request);
    }

    /**
     * Get driver's profile using token
     */
    @GetMapping("/profile")
    public Driver getProfile(@RequestHeader("Authorization") String token) {
        return driverService.getProfile(stripToken(token));
    }

    /**
     * Toggle driver's availability status (online/offline)
     */
    @PostMapping("/availability")
    public void updateAvailability(@RequestHeader("Authorization") String token,
                                   @RequestParam boolean available) {
        driverService.updateAvailability(stripToken(token), available);
    }

    /**
     * Get all ride requests (unassigned rides)
     */
    @GetMapping("/rides/requests")
    public List<Ride> getAvailableRideRequests() {
        return driverService.getAvailableRideRequests();
    }

    /**
     * Accept a ride (if still unassigned)
     */
    @PostMapping("/rides/accept")
    public Ride acceptRide(@RequestHeader("Authorization") String token,
                           @RequestParam Long rideId) {
        return driverService.acceptRide(stripToken(token), rideId);
    }

    /**
     * Update current ride's status (IN_PROGRESS or COMPLETED)
     */
    @PostMapping("/rides/status")
    public void updateRideStatus(@RequestHeader("Authorization") String token,
                                 @RequestParam String status) {
        driverService.updateRideStatus(stripToken(token), status);
    }

    /**
     * View current active ride (ACCEPTED or IN_PROGRESS)
     */
    @GetMapping("/rides/current")
    public ResponseEntity<Ride> getCurrentRide(@RequestHeader("Authorization") String token) {
        try {
            Ride currentRide = driverService.getCurrentRide(stripToken(token));
            return ResponseEntity.ok(currentRide);
        } catch (RuntimeException e) {
            if (e.getMessage().equals("No active ride found")) {
                return ResponseEntity.notFound().build(); // 404 instead of 500
            }
            throw e; // Re-throw other exceptions
        }
    }

    /**
     * View completed ride history for driver
     */
    @GetMapping("/rides/history")
    public List<RideHistoryResponse> getRideHistory(@RequestHeader("Authorization") String token) {
        return driverService.getRideHistory(stripToken(token));
    }

    /**
     * Utility to strip "Bearer " prefix
     */
    private String stripToken(String token) {
        return token.startsWith("Bearer ") ? token.substring(7) : token;
    }
}
