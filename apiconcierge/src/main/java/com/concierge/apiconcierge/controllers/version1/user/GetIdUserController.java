package com.concierge.apiconcierge.controllers.version1.user;

import com.concierge.apiconcierge.models.user.User;
import com.concierge.apiconcierge.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/user/filter/id/{id}")
public class GetIdUserController {
    @Autowired
    UserRepository repository;

    @GetMapping
    public ResponseEntity<Optional<User>> getUserId(@PathVariable(value = "id") Integer id) {
        Optional<User> user = repository.findById(id);

        if (user.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        return ResponseEntity.ok(user);
    }
}
