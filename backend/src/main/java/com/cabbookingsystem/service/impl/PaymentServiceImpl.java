package com.cabbookingsystem.service.impl;

import com.cabbookingsystem.dto.PaymentRequest;
import com.cabbookingsystem.entity.Payment;
import com.cabbookingsystem.entity.Ride;
import com.cabbookingsystem.enums.PaymentMethod;
import com.cabbookingsystem.repository.PaymentRepository;
import com.cabbookingsystem.repository.RideRepository;
import com.cabbookingsystem.service.PaymentService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepo;
    private final RideRepository rideRepo;

    /**
     * Processes (simulates) a payment after a ride.
     * Saves the payment info and marks status as "SUCCESS".
     */
    @Override
    public Payment processPayment(PaymentRequest request) {
        // Fetch the ride
        Ride ride = rideRepo.findById(request.getRideId())
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        // Simulate payment — create Payment entity
        Payment payment = Payment.builder()
                .ride(ride)
                .amount(request.getAmount())
                .method(request.getMethod())
                .status("SUCCESS") // hardcoded for simulation
                .timestamp(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                .build();

        return paymentRepo.save(payment);
    }

    /**
     * Fetches payment receipt for a ride.
     * Used to show on frontend after successful payment.
     */
    @Override
    public Payment getReceipt(Long rideId) {
        return paymentRepo.findByRideRideId(rideId);
    }
}
