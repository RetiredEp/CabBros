package com.cabbookingsystem.service;

import com.cabbookingsystem.dto.DriverLoginRequest;
import com.cabbookingsystem.dto.DriverRegisterRequest;
import com.cabbookingsystem.dto.RideHistoryResponse;
import com.cabbookingsystem.entity.Driver;
import com.cabbookingsystem.entity.Ride;

import java.util.List;

public interface DriverService {

    /**
     * Registers a new driver with vehicle and license info.
     * Creates a Driver entity, so belongs here.
     */
    String register(DriverRegisterRequest request);

    /**
     * Authenticates a driver and returns a JWT token.
     * Driver-specific login logic.
     */
    String login(DriverLoginRequest request);

    /**
     * Retrieves the driver's profile using JWT token.
     */
    Driver getProfile(String token);

    /**
     * Toggles driver's availability (online/offline).
     * This changes the `available` field on the Driver entity.
     */
    void updateAvailability(String token, boolean available);

    /**
     * Gets all ride requests with status = REQUESTED and not yet assigned.
     * Belongs here as drivers use this to view broadcasted requests.
     */
    List<Ride> getAvailableRideRequests();

    /**
     * Driver accepts one of the ride requests.
     * Will assign the driver to the ride and change status to ACCEPTED.
     * Belongs here because this action is driven by the driver entity.
     */
    Ride acceptRide(String token, Long rideId);

    /**
     * Gets the current ride that is either ACCEPTED or IN_PROGRESS.
     * Driver needs this to manage ongoing ride.
     */
    Ride getCurrentRide(String token);

    /**
     * Updates the current ride's status (e.g., STARTED, COMPLETED).
     * Belongs here as the driver triggers this progression.
     */
    void updateRideStatus(String token, String status);

    /**
     * Returns the driver's past completed rides with payment and rating info.
     * Specific to the Driver entity, hence belongs here.
     */
    List<RideHistoryResponse> getRideHistory(String token);
}
