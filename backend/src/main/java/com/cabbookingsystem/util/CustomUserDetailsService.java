package com.cabbookingsystem.util;


import com.cabbookingsystem.entity.User;
import com.cabbookingsystem.repository.DriverRepository;
import com.cabbookingsystem.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

import com.cabbookingsystem.entity.Driver;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    private final DriverRepository driverRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Try User
        User user = userRepository.findByEmail(username).orElse(null);
        if (user != null) {
            return new org.springframework.security.core.userdetails.User(
                    user.getEmail(),
                    user.getPasswordHash(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
            );
        }
        // Try Driver by email
        Driver driver = driverRepository.findByEmail(username).orElse(null);
        if (driver != null) {
            return new org.springframework.security.core.userdetails.User(
                    driver.getEmail(),
                    driver.getPasswordHash(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + driver.getRole().name()))
            );
        }
        throw new UsernameNotFoundException("User or Driver not found with username: " + username);
    }
}