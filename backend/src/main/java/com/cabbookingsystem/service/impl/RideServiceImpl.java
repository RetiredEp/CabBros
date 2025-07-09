package com.cabbookingsystem.service.impl;

import com.cabbookingsystem.entity.Driver;
import com.cabbookingsystem.entity.Ride;
import com.cabbookingsystem.entity.User;
import com.cabbookingsystem.enums.RideStatus;
import com.cabbookingsystem.repository.DriverRepository;
import com.cabbookingsystem.repository.RideRepository;
import com.cabbookingsystem.repository.UserRepository;
import com.cabbookingsystem.service.RideService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RideServiceImpl implements RideService {

        private final RideRepository rideRepo;
        private final UserRepository userRepo;
        private final DriverRepository driverRepo;

        /**
         * Creates a new ride with status = REQUESTED.
         * Used by UserService when a ride is booked.
         */
        @Override
        public Ride createRide(Ride ride) {
                ride.setStatus(RideStatus.REQUESTED);
                return rideRepo.save(ride);
        }

        /**
         * Assigns a driver to a ride if it's unassigned.
         * Also updates status to ACCEPTED.
         * Used by DriverService to accept a ride.
         */
        @Override
        public Ride assignDriverToRide(Long rideId, Long driverId) {
                Ride ride = rideRepo.findById(rideId)
                        .orElseThrow(() -> new RuntimeException("Ride not found"));

                if (ride.getDriver() != null || ride.getStatus() != RideStatus.REQUESTED) {
                        throw new RuntimeException("Ride already accepted");
                }

                Driver driver = driverRepo.findById(driverId)
                        .orElseThrow(() -> new RuntimeException("Driver not found"));

                ride.setDriver(driver);
                ride.setStatus(RideStatus.ACCEPTED);
                return rideRepo.save(ride);
        }

        /**
         * Updates the ride status.
         * Called from UserService or DriverService to reflect progress.
         */
        @Override
        public void updateRideStatus(Long rideId, String status) {
                Ride ride = rideRepo.findById(rideId)
                        .orElseThrow(() -> new RuntimeException("Ride not found"));

                ride.setStatus(RideStatus.valueOf(status.toUpperCase()));
                rideRepo.save(ride);
        }

        /**
         * Fetch ride by ID — used for payment or rating lookup
         */
        @Override
        public Ride getRideById(Long rideId) {
                return rideRepo.findById(rideId)
                        .orElseThrow(() -> new RuntimeException("Ride not found"));
        }

        /**
         * Returns all rides booked by a user.
         * Used in UserService → getRideHistory()
         */
        @Override
        public List<Ride> getRidesByUserId(Long userId) {
                return rideRepo.findByUserUserId(userId);
        }

        /**
         * Returns all rides completed by a driver.
         * Used in DriverService → getRideHistory()
         */
        @Override
        public List<Ride> getRidesByDriverId(Long driverId) {
                return rideRepo.findByDriverDriverId(driverId);
        }

        /**
         * Gets active ride (ACCEPTED or IN_PROGRESS) for a user
         */
        @Override
        public Ride getActiveRideByUserId(Long userId) {
                return rideRepo.findActiveRideByUserId(userId)
                        .orElseThrow(() -> new RuntimeException("No active ride found"));
        }

        /**
         * Gets active ride (ACCEPTED or IN_PROGRESS) for a driver
         */
        @Override
        public Ride getActiveRideByDriverId(Long driverId) {
                return rideRepo.findActiveRideByDriverId(driverId)
                        .orElseThrow(() -> new RuntimeException("No active ride found"));
        }

        /**
         * Returns all ride requests that are REQUESTED and not yet assigned.
         * Drivers will fetch these to choose from.
         */
        @Override
        public List<Ride> getUnassignedRideRequests() {
                return rideRepo.findUnassignedRideRequests();
        }
}
