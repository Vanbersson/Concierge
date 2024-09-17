package com.concierge.apiconcierge.controllers.version1.user;

import com.concierge.apiconcierge.dtos.user.UserResponseDto;
import com.concierge.apiconcierge.models.user.User;
import com.concierge.apiconcierge.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/user/filter/roleid/{roleid}")
public class GetRoleIdUserController {

    @Autowired
    UserRepository repository;

    @GetMapping
    public ResponseEntity<List<Object>> getUserRoleId(@PathVariable(name = "roleid") Integer roleId) {
        List<User> list = repository.findByRoleId(roleId);
        List<Object> users = new ArrayList();
        for(User item: list){
            Object ob = new UserResponseDto(
                    item.getCompanyId(),
                    item.getResaleId(),
                    item.getId(),
                    item.getStatus(),
                    item.getName(),
                    item.getEmail(),
                    item.getCellphone(),
                    item.getLimitDiscount(),
                    item.getPhoto(),
                    item.getRoleId(),
                    item.getRoleDesc(),
                    item.getRoleFunc());
            users.add(ob);
        }
        return ResponseEntity.ok(users);
    }
}
