package com.cabbookingsystem.repository;

import com.cabbookingsystem.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    @Query("SELECT r FROM Rating r WHERE r.ride.driver.driverId = :driverId")
    List<Rating> findByDriverId(Long driverId);
    
    Rating findByRideRideId(Long rideId);
}
