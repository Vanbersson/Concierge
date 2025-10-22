package com.concierge.apiconcierge.controllers.permission;

import com.concierge.apiconcierge.dtos.message.MessageResponseDto;
import com.concierge.apiconcierge.dtos.permission.PermissionUserDto;
import com.concierge.apiconcierge.dtos.permission.PermissionUserSaveDto;
import com.concierge.apiconcierge.models.message.MessageResponse;
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
            MessageResponse response = this.service.save(permission);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/{companyId}/{resaleId}/filter/u/{userId}")
    public ResponseEntity<Object> filterUser(@PathVariable(name = "companyId") Integer companyId,
                                             @PathVariable(name = "resaleId") Integer resaleId,
                                             @PathVariable(value = "userId") Integer userId) {
        try {
            MessageResponse response = this.service.filterUser(companyId, resaleId, userId);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/{companyId}/{resaleId}/filter/u/{userId}/p/{permission}")
    public ResponseEntity<Object> filterUserPermission(@PathVariable(name = "companyId") Integer companyId,
                                                       @PathVariable(name = "resaleId") Integer resaleId,
                                                       @PathVariable(value = "userId") Integer userId,
                                                       @PathVariable(value = "permission") Integer permission) {
        try {
            MessageResponse response = this.service.filterUserPermission(companyId, resaleId, userId, permission);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @PostMapping("/all/delete")
    public ResponseEntity<Object> deleteAllUser(@RequestBody PermissionUserDto data) {
        try {
            MessageResponse response = this.service.deletePermissionsUser(data.companyId(), data.resaleId(), data.userId());
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }
}
