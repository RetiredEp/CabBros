package com.cabbookingsystem.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RideStatusUpdateRequest {
    private Long rideId;
    private String status; // e.g. REQUESTED, ACCEPTED, IN_PROGRESS, COMPLETED
}
