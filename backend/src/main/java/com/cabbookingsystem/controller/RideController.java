package com.cabbookingsystem.controller;

import com.cabbookingsystem.entity.Ride;
import com.cabbookingsystem.service.RideService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RideController {

    private final RideService rideService;

    /**
     * Get ride by ID — used by payment/rating pages
     */
    @GetMapping("/{rideId}")
    public Ride getRideById(@PathVariable Long rideId) {
        return rideService.getRideById(rideId);
    }

    /**
     * Admin/debug endpoint — manually update status of a ride
     * Status: REQUESTED, ACCEPTED, IN_PROGRESS, COMPLETED
     */
    @PostMapping("/{rideId}/status")
    public void updateStatus(@PathVariable Long rideId,
                             @RequestParam String status) {
        rideService.updateRideStatus(rideId, status);
    }
}
