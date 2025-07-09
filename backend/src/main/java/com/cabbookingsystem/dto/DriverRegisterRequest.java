package com.cabbookingsystem.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverRegisterRequest {
    private String name;
    private String email;
    private String phone;
    private String password;
    private String licenseNumber;
    private String vehicleDetails;
}
