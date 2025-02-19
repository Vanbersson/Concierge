package com.concierge.apiconcierge.controllers.version1.permission;

import com.concierge.apiconcierge.models.permissions.Permission;
import com.concierge.apiconcierge.repositories.permission.PermissionIRepository;
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
    private PermissionIRepository permissionIRepository;

    @GetMapping("/all")
    public ResponseEntity<List<Permission>> allPermission() {
        return ResponseEntity.ok(this.permissionIRepository.findAll());
    }

}
