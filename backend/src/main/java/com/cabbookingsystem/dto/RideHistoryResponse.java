package com.cabbookingsystem.dto;

import com.cabbookingsystem.entity.Driver;
import com.cabbookingsystem.entity.User;
import com.cabbookingsystem.enums.PaymentMethod;
import com.cabbookingsystem.enums.RideStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RideHistoryResponse {
    private Long rideId;
    private User user;
    private Driver driver;
    private String pickupLocation;
    private String dropoffLocation;
    private double fare;
    private double distance;
    private RideStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Payment information
    private PaymentMethod paymentMethod;
    private String paymentStatus;
    private String paymentTimestamp;
    
    // Rating information
    private Integer ratingScore;
    private String ratingComment;
}
