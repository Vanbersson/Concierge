package com.concierge.apiconcierge.controllers;

import com.concierge.apiconcierge.dtos.PermissionUserDto;
import com.concierge.apiconcierge.models.permissions.Permission;
import com.concierge.apiconcierge.models.permissions.PermissionUser;
import com.concierge.apiconcierge.models.resales.Resale;
import com.concierge.apiconcierge.models.user.User;
import com.concierge.apiconcierge.repositories.PermissionRepository;
import com.concierge.apiconcierge.repositories.PermissionUserRepository;
import com.concierge.apiconcierge.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/permissionUser")
public class PermissionUserController {

    @Autowired
    PermissionUserRepository permissionUserRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PermissionRepository permissionRepository;

    @PostMapping("/add")
    public ResponseEntity<Object> addPermissionUser(@RequestBody @Valid PermissionUserDto data) {

        Optional<User> user = userRepository.findById(data.userId());

        //Validation
        if (user.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        //Validation
        if (user.get().getResaleId() != data.resaleId()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Optional<Permission> permission = permissionRepository.findById(data.permissionId());

        //Validation
        if (permission.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        PermissionUser permission0 = permissionUserRepository.findByResaleIdAndUserIdAndPermissionId(data.resaleId(), data.userId(), data.permissionId());

        //Validation
        if (permission0 != null) return ResponseEntity.status(HttpStatus.CONFLICT).body("Permission already exists.");

        PermissionUser permissionUser = new PermissionUser();
        BeanUtils.copyProperties(data, permissionUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(permissionUserRepository.save(permissionUser));

    }

    @GetMapping("/resale/{resale}/user/{user}")
    public ResponseEntity<List<PermissionUser>> idUser(@PathVariable(value = "resale") Integer resaleId, @PathVariable(value = "user") Integer userId) {
        List<PermissionUser> users = permissionUserRepository.findByResaleIdAndUserId(resaleId, userId);

        if (users.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        return ResponseEntity.ok(users);

    }

    @PostMapping("/remove/permission")
    public ResponseEntity removeUser(@RequestBody @Valid PermissionUserDto data) {

        Optional<PermissionUser> permissionUser = permissionUserRepository.findById(data.id());

        if (permissionUser.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        permissionUserRepository.deleteById(data.id());

        return ResponseEntity.ok("Permission successfully removed.");


    }
}
