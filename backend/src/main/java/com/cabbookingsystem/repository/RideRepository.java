package com.cabbookingsystem.repository;

import com.cabbookingsystem.entity.Ride;
import com.cabbookingsystem.enums.RideStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RideRepository extends JpaRepository<Ride, Long> {

    @Query("SELECT r FROM Ride r WHERE r.status = 'REQUESTED' AND r.driver IS NULL")
    List<Ride> findUnassignedRideRequests();

    @Query("SELECT r FROM Ride r WHERE r.driver.driverId = :driverId AND r.status IN ('ACCEPTED', 'IN_PROGRESS')")
    Optional<Ride> findActiveRideByDriverId(Long driverId);

    @Query("SELECT r FROM Ride r WHERE r.user.userId = :userId AND (r.status IN ('ACCEPTED', 'IN_PROGRESS') OR (r.status = 'COMPLETED' AND NOT EXISTS (SELECT p FROM Payment p WHERE p.ride = r)))")
    Optional<Ride> findActiveRideByUserId(Long userId);


    List<Ride> findByUserUserId(Long userId); // ✅ For user's ride history

    List<Ride> findByDriverDriverId(Long driverId);

}
