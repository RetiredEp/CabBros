package com.cabbookingsystem.entity;

import com.cabbookingsystem.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @OneToOne
    private Ride ride;

    private double amount;

    @Enumerated(EnumType.STRING)
    private PaymentMethod method;

    private String status;
    private String timestamp;
}
