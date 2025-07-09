package com.cabbookingsystem.repository;

import com.cabbookingsystem.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DriverRepository extends JpaRepository<Driver, Long> {
    List<Driver> findByAvailableTrue();

    Optional<Driver> findByEmail(String email);

}