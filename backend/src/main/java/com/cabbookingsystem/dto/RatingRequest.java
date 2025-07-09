package com.cabbookingsystem.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingRequest {
    private Long rideId;
    private Long driverId;
    private Integer rating;    // e.g. 1 to 5 (to match frontend)
    private String review;     // comment (to match frontend)
}
