package com.cabbookingsystem.service;

import com.cabbookingsystem.entity.Ride;

import java.util.List;

public interface RideService {

    /**
     * Creates a ride record and sets status as REQUESTED.
     * Called by UserService during booking.
     */
    Ride createRide(Ride ride);

    /**
     * Assigns a driver to a ride if it's not already accepted.
     * Prevents race condition in accepting rides.
     */
    Ride assignDriverToRide(Long rideId, Long driverId);

    /**
     * Updates ride status (e.g., ACCEPTED, IN_PROGRESS, COMPLETED).
     * Central method used by UserService or DriverService.
     */
    void updateRideStatus(Long rideId, String status);

    /**
     * Fetches a ride using ID.
     * Needed by all services for details/lookup.
     */
    Ride getRideById(Long rideId);

    /**
     * Fetches all rides associated with a specific user.
     * Supports user ride history.
     */
    List<Ride> getRidesByUserId(Long userId);

    /**
     * Fetches all rides associated with a specific driver.
     * Supports driver ride history.
     */
    List<Ride> getRidesByDriverId(Long driverId);

    /**
     * Gets the user's currently active ride.
     * Used for real-time status display.
     */
    Ride getActiveRideByUserId(Long userId);

    /**
     * Gets the driver's currently active ride.
     */
    Ride getActiveRideByDriverId(Long driverId);

    /**
     * Fetches all ride requests with status = REQUESTED and driver = null.
     * For drivers to view open requests.
     */
    List<Ride> getUnassignedRideRequests();
}
