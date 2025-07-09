package com.cabbookingsystem.service;

import com.cabbookingsystem.dto.RatingRequest;
import com.cabbookingsystem.entity.Rating;

import java.util.List;

public interface RatingService {

    /**
     * Submits a new rating for a ride.
     * Should only be allowed after ride completion.
     */
    Rating submitRating(RatingRequest request);

    /**
     * Returns all ratings received by a specific driver.
     * Used to display driver’s profile and feedback.
     */
    List<Rating> getRatingsForDriver(Long driverId);
}
