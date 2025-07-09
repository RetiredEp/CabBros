package com.cabbookingsystem.service;

import com.cabbookingsystem.dto.PaymentRequest;
import com.cabbookingsystem.entity.Payment;

public interface PaymentService {

    /**
     * Processes or simulates a payment for a ride.
     * Called after ride completion before rating.
     */
    Payment processPayment(PaymentRequest request);

    /**
     * Returns payment receipt for a ride.
     * Displayed to user or driver (received fare).
     */
    Payment getReceipt(Long rideId);
}
