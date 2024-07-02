package com.concierge.apiconcierge.controllers.version1;


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
@RequestMapping("/role")
public class UserRoleController {

    @Autowired
    UserRoleRepository userRoleRepository;

    @PostMapping("/add")
    public ResponseEntity<Object> addRole(@RequestBody @Valid UserRoleDto data) {

        UserRole role = new UserRole();

        BeanUtils.copyProperties(data, role);

        role.setId(0);

        return ResponseEntity.status(HttpStatus.CREATED).body(userRoleRepository.save(role));

    }

    @PostMapping("/update")
    public ResponseEntity<Object> updateRole(@RequestBody @Valid UserRoleDto data) {

        UserRole role = new UserRole();
        BeanUtils.copyProperties(data, role);

        return ResponseEntity.status(HttpStatus.OK).body(userRoleRepository.save(role));
    }

    @GetMapping("/all/{companyid}/{resaleid}")
    public ResponseEntity<List<UserRole>> allRole(@PathVariable(value = "companyid") Integer companyId, @PathVariable(value = "resaleid") Integer resaleId) {

        List<UserRole> roles = userRoleRepository.findAll();

        return ResponseEntity.ok(roles);

    }


}
