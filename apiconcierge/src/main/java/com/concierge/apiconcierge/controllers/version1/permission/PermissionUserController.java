package com.concierge.apiconcierge.controllers.version1.permission;

import com.concierge.apiconcierge.dtos.permission.PermissionUserDeleteDto;
import com.concierge.apiconcierge.dtos.permission.PermissionUserDto;
import com.concierge.apiconcierge.dtos.permission.PermissionUserSaveDto;
import com.concierge.apiconcierge.models.permissions.PermissionUser;
import com.concierge.apiconcierge.repositories.permission.PermissionIRepository;
import com.concierge.apiconcierge.repositories.permission.PermissionUserIRepository;
import com.concierge.apiconcierge.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/permission/user")
public class PermissionUserController {

    @Autowired
    PermissionUserIRepository permissionUserIRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PermissionIRepository permissionIRepository;

    @PostMapping("/save")
    public ResponseEntity<Object> savePermissionUser(@RequestBody @Valid PermissionUserSaveDto data) {

        PermissionUser permission0 = this.permissionUserIRepository.findByUserIdAndPermissionId(data.userId(), data.permissionId());
        //Validation
        if (permission0 != null) return ResponseEntity.status(HttpStatus.CONFLICT).body("Permission already exists.");

        PermissionUser permissionUser = new PermissionUser();
        BeanUtils.copyProperties(data, permissionUser);
        permissionUser.setId(null);

        //delete all user permissions
        this.permissionUserIRepository.deleteUser(permissionUser.getUserId());

        //save new permission
        this.permissionUserIRepository.save(permissionUser);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/filter/user/{userid}")
    public ResponseEntity<List<PermissionUser>> idUser(@PathVariable(value = "userid") Integer userId) {
        List<PermissionUser> users = this.permissionUserIRepository.findByUserId(userId);
        return ResponseEntity.ok(users);
    }


    @PostMapping("/all/delete")
    public ResponseEntity<Object> deleteAllPermissionUser(@RequestBody @Valid PermissionUserDeleteDto data) {
        this.permissionUserIRepository.deleteUser(data.userId());
        return ResponseEntity.ok().build();
    }
}
