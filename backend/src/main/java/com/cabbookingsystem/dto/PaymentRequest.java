package com.cabbookingsystem.dto;

import com.cabbookingsystem.enums.PaymentMethod;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequest {
    private Long rideId;
    private double amount;
    private PaymentMethod method;
}
