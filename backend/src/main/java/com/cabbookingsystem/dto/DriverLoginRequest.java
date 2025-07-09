package com.cabbookingsystem.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverLoginRequest {
    private String email;
    private String password;
}
