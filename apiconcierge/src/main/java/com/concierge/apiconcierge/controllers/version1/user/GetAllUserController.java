package com.concierge.apiconcierge.controllers.version1.user;

import com.concierge.apiconcierge.models.user.User;
import com.concierge.apiconcierge.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/user/all")
public class GetAllUserController {

    @Autowired
    UserRepository repository;

    @GetMapping
    public ResponseEntity<List<User>> allUser() {
        List<User> list = repository.findAll();
        return ResponseEntity.ok(list);
    }
}
