package com.cabbookingsystem.entity;

import com.cabbookingsystem.enums.Role;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Driver {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long driverId;

    private String name;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(unique = true, nullable = false)
    private String phone;
    @Column(unique = true)
    private String passwordHash;

    private String licenseNumber;
    private String vehicleDetails;
    private boolean available;

    @Enumerated(EnumType.STRING)
    private Role role;
}


