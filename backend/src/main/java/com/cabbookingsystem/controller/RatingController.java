package com.cabbookingsystem.controller;

import com.cabbookingsystem.dto.RatingRequest;
import com.cabbookingsystem.entity.Rating;
import com.cabbookingsystem.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    /**
     * Submit a rating after ride completion
     * Expects rideId, score, and optional comment
     */
    @PostMapping("/submit")
    public Rating submitRating(@RequestBody RatingRequest request) {
        return ratingService.submitRating(request);
    }

    /**
     * Get all ratings for a driver using driverId
     * Useful for admin dashboards
     */
    @GetMapping("/driver/{driverId}")
    public List<Rating> getRatingsForDriver(@PathVariable Long driverId) {
        return ratingService.getRatingsForDriver(driverId);
    }

    /**
     * Get all ratings for a driver using phone number
     * Used in driver dashboard (based on token)
     */
//    @GetMapping("/driver/phone")
//    public List<Rating> getRatingsByPhone(@RequestHeader("Authorization") String token) {
//        return ratingService.getRatingsForDriver(stripToken(token));
//    }

    /**
     * Utility to remove Bearer prefix from token
     */
    private String stripToken(String token) {
        return token.startsWith("Bearer ") ? token.substring(7) : token;
    }
}
