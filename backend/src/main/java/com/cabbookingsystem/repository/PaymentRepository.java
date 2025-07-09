package com.cabbookingsystem.repository;

import com.cabbookingsystem.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByRideRideId(Long rideId);
}
