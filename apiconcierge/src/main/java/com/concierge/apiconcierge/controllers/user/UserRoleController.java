package com.concierge.apiconcierge.controllers.version1.user;


import com.concierge.apiconcierge.dtos.UserRoleDto;
import com.concierge.apiconcierge.models.role.UserRole;
import com.concierge.apiconcierge.repositories.user.IUserRoleRepository;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user/role")
public class UserRoleController {

    @Autowired
    IUserRoleRepository repository;

    @PostMapping("/save")
    public ResponseEntity<Object> saveRole(@RequestBody @Valid UserRoleDto data) {

        UserRole role = new UserRole();

        BeanUtils.copyProperties(data, role);

        role.setId(0);

        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(role));

    }

    @PostMapping("/update")
    public ResponseEntity<Object> updateRole(@RequestBody @Valid UserRoleDto data) {

        UserRole role = new UserRole();
        BeanUtils.copyProperties(data, role);

        return ResponseEntity.status(HttpStatus.OK).body(repository.save(role));
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserRole>> allRole() {
        List<UserRole> roles = repository.findAll();
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/all/enabled")
    public ResponseEntity<List<UserRole>> allRoleEnabled() {
        List<UserRole> roles = repository.listEnabled();
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/filter/id/{id}")
    public ResponseEntity<UserRole> getId(@PathVariable(value = "id") Integer id) {
        Optional<UserRole> userRole = repository.findById(id);
        if (userRole.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        UserRole role = userRole.get();
        return ResponseEntity.status(HttpStatus.OK).body(role);

    }


}
