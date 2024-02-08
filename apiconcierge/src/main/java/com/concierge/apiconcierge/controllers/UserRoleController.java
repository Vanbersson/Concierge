package com.concierge.apiconcierge.controllers;


import com.concierge.apiconcierge.dtos.ResaleDto;
import com.concierge.apiconcierge.dtos.UserRoleDto;
import com.concierge.apiconcierge.models.resales.Resale;
import com.concierge.apiconcierge.models.role.UserRole;
import com.concierge.apiconcierge.repositories.UserRoleRepository;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/role/user")
public class UserRoleController {

    @Autowired
    UserRoleRepository userRoleRepository;

    @PostMapping("/add")
    public ResponseEntity<Object> addRole(@RequestBody @Valid UserRoleDto data) {
        Optional<UserRole> role0 = userRoleRepository.findById(data.id());

        if (role0 != null) return ResponseEntity.status(HttpStatus.CONFLICT).body("Role exists.");

        UserRole role = new UserRole();
        BeanUtils.copyProperties(data, role);

        return ResponseEntity.status(HttpStatus.CREATED).body(userRoleRepository.save(role));

    }

    @PostMapping("/update")
    public ResponseEntity<Object> updateRole(@RequestBody @Valid UserRoleDto data) {
        Optional<UserRole> role0 = userRoleRepository.findById(data.id());

        if (role0.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        UserRole role = new UserRole();
        BeanUtils.copyProperties(data, role);

        return ResponseEntity.status(HttpStatus.OK).body(userRoleRepository.save(role));
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserRole>> allRole() {

        List<UserRole> roles = userRoleRepository.findAll();
        if (roles.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        return ResponseEntity.ok(roles);

    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Object> idRole(@PathVariable(value = "id") Integer id) {
        Optional<UserRole> role0 = userRoleRepository.findById(id);

        if (role0.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        return ResponseEntity.ok(role0);

    }

}
