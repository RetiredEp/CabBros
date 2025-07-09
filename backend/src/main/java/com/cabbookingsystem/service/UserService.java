package com.cabbookingsystem.service;

import com.cabbookingsystem.dto.UserLoginRequest;
import com.cabbookingsystem.dto.UserRegisterRequest;
import com.cabbookingsystem.dto.RideHistoryResponse;
import com.cabbookingsystem.entity.User;
import com.cabbookingsystem.entity.Ride;

import java.util.List;

public interface UserService {

    /**
     * Registers a new user using the request details.
     * This belongs here because it creates a User entity.
     */
    String register(UserRegisterRequest request);

    /**
     * Authenticates the user and returns a JWT token.
     * Only user-related login logic should be here.
     */
    String login(UserLoginRequest request);

    /**
     * Retrieves the user's profile using token (usually parsed for email/ID).
     * Related to user-specific access and entity fetching.
     */
    User getProfile(String token);

    /**
     * Books a ride by the authenticated user.
     * This involves creating a Ride entity and linking it to the user.
     * Delegates Ride creation to RideService internally.
     */
    Ride bookRide(String token, Ride rideRequest);

    /**
     * Gets the currently active ride (ACCEPTED or IN_PROGRESS) for the user.
     * Only the user needs this to track progress.
     */
    Ride getCurrentRide(String token);

    /**
     * Returns the ride history (COMPLETED rides) of the user.
     * Belongs here since it's specific to the user entity.
     */
    List<RideHistoryResponse> getRideHistory(String token);
}
