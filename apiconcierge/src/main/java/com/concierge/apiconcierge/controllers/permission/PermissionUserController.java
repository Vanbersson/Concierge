package com.concierge.apiconcierge.controllers.permission;

import com.concierge.apiconcierge.dtos.message.MessageResponseDto;
import com.concierge.apiconcierge.dtos.permission.PermissionUserDto;
import com.concierge.apiconcierge.dtos.permission.PermissionUserSaveDto;
import com.concierge.apiconcierge.models.permission.PermissionUser;
import com.concierge.apiconcierge.repositories.permission.IPermissionRepository;
import com.concierge.apiconcierge.repositories.permission.IPermissionUserRepository;
import com.concierge.apiconcierge.repositories.user.IUserRepository;
import com.concierge.apiconcierge.services.permission.PermissionUserService;
import com.concierge.apiconcierge.util.ConstantsMessage;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/permission/user")
public class PermissionUserController {

    @Autowired
    PermissionUserService service;

    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody PermissionUserDto data) {
        try {
            PermissionUser permission = new PermissionUser();
            BeanUtils.copyProperties(data, permission);

            String message = this.service.save(permission);

            return ResponseEntity.status(HttpStatus.CREATED).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/filter/user/{userId}")
    public ResponseEntity<Object> filterIdUser(@PathVariable(value = "userId") Integer userId) {
        try {
            List<PermissionUser> permissions = this.service.filterPermissionUser(userId);
            return ResponseEntity.status(HttpStatus.OK).body(permissions);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }


    @PostMapping("/all/delete")
    public ResponseEntity<Object> deleteAllPermissionUser(@RequestBody Map<String, Integer> request) {
        try {
            Integer userId = request.get("userId");
            String message = this.service.deletePermissionsUser(userId);

            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }

    }
}
