package com.cabbookingsystem.controller;

import com.cabbookingsystem.dto.PaymentRequest;
import com.cabbookingsystem.entity.Payment;
import com.cabbookingsystem.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Simulates payment after ride completion
     * Expects rideId, amount, and method in body
     */
    @PostMapping("/pay")
    public Payment processPayment(@RequestBody PaymentRequest request) {
        return paymentService.processPayment(request);
    }

    /**
     * Get payment receipt by ride ID
     * Used after successful payment to show summary
     */
    @GetMapping("/receipt/{rideId}")
    public Payment getReceipt(@PathVariable Long rideId) {
        return paymentService.getReceipt(rideId);
    }
}
