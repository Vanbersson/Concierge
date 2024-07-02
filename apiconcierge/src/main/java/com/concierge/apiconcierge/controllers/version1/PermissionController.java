package com.concierge.apiconcierge.controllers.version1;

import com.concierge.apiconcierge.models.permissions.Permission;
import com.concierge.apiconcierge.repositories.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/permission")
public class PermissionController {

    @Autowired
    PermissionRepository permissionRepository;

    @GetMapping("/all")
    public ResponseEntity<List<Permission>> allPermission() {

        return ResponseEntity.ok(permissionRepository.findAll());

    }


}
