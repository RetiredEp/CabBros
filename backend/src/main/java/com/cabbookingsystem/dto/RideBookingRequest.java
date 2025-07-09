package com.cabbookingsystem.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RideBookingRequest {
    private String pickupLocation;
    private String dropoffLocation;
    private double distance;    // Calculated on frontend (Leaflet)
    private double duration;    // Same as above
    private double fare;        // Either sent by frontend or calculated in backend
}
