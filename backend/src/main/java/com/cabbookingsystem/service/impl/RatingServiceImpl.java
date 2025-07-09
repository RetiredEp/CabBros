package com.cabbookingsystem.service.impl;

import com.cabbookingsystem.dto.RatingRequest;
import com.cabbookingsystem.entity.Rating;
import com.cabbookingsystem.entity.Ride;
import com.cabbookingsystem.entity.Driver;
import com.cabbookingsystem.repository.RatingRepository;
import com.cabbookingsystem.repository.RideRepository;
import com.cabbookingsystem.repository.DriverRepository;
import com.cabbookingsystem.service.RatingService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepo;
    private final RideRepository rideRepo;
    private final DriverRepository driverRepo;

    /**
     * Submit rating without validation (DEV mode)
     */
    @Override
    public Rating submitRating(RatingRequest request) {
        Ride ride = rideRepo.findById(request.getRideId())
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        Rating rating = Rating.builder()
                .ride(ride)
                .score(request.getRating())
                .comment(request.getReview())
                .build();

        return ratingRepo.save(rating);
    }

    /**
     * Get all ratings for a driver by driverId (admin/report use)
     */
    @Override
    public List<Rating> getRatingsForDriver(Long driverId) {
        return ratingRepo.findByDriverId(driverId);
    }

    /**
     * Get all ratings for a driver using phone (for dashboard)
     */
//    @Override
//    public List<Rating> getRatingsForDriver(String phone) {
//        Driver driver = driverRepo.findByPhone(phone)
//                .orElseThrow(() -> new RuntimeException("Driver not found"));
//        return ratingRepo.findByDriverId(driver.getDriverId());
//    }
}
