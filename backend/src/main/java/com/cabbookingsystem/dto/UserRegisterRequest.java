package com.cabbookingsystem.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRegisterRequest {
    private String name;
    private String email;
    private String phone;
    private String password;
}
