package com.concierge.apiconcierge.controllers.user;

import com.concierge.apiconcierge.dtos.message.MessageResponseDto;
import com.concierge.apiconcierge.dtos.user.UserDto;
import com.concierge.apiconcierge.models.user.User;
import com.concierge.apiconcierge.services.user.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserService service;

    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody UserDto data) {
        try {
            User user = new User();
            BeanUtils.copyProperties(data, user);
            Integer id = this.service.save(user);
            Map<String, Object> map = new HashMap<>();
            map.put("id", id);

            return ResponseEntity.status(HttpStatus.CREATED).body(map);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @PostMapping("/update")
    public ResponseEntity<Object> update(@RequestBody UserDto data) {
        try {
            User user = new User();
            BeanUtils.copyProperties(data, user);
            String message = this.service.update(user);

            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/{companyId}/{resaleId}/all")
    public ResponseEntity<Object> listAll(@PathVariable(name = "companyId") Integer companyId,
                                          @PathVariable(name = "resaleId") Integer resaleId) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(this.service.listAll(companyId, resaleId));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/{companyId}/{resaleId}/filter/id/{id}")
    public ResponseEntity<Object> filterEmail(@PathVariable(name = "companyId") Integer companyId,
                                              @PathVariable(name = "resaleId") Integer resaleId,
                                              @PathVariable(name = "id") Integer id) {
        try {
            Map<String, Object> userResult = this.service.filterId(companyId, resaleId, id);
            if (userResult.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

            return ResponseEntity.status(HttpStatus.OK).body(userResult);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/{companyId}/{resaleId}/filter/email/{email}")
    public ResponseEntity<Object> filterEmail(@PathVariable(name = "companyId") Integer companyId,
                                              @PathVariable(name = "resaleId") Integer resaleId,
                                              @PathVariable(name = "email") String email) {
        try {
            Map<String, Object> userResult = this.service.filterEmail(companyId, resaleId, email);
            if (userResult.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

            return ResponseEntity.status(HttpStatus.OK).body(userResult);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/{companyId}/{resaleId}/filter/roleId/{roleId}")
    public ResponseEntity<Object> filterRole(@PathVariable(name = "companyId") Integer companyId,
                                             @PathVariable(name = "resaleId") Integer resaleId,
                                             @PathVariable(name = "roleId") Integer roleId) {
        try {
            List<Map<String, Object>> list = this.service.filterRoleId(companyId, resaleId, roleId);
            return ResponseEntity.status(HttpStatus.OK).body(list);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }


}
