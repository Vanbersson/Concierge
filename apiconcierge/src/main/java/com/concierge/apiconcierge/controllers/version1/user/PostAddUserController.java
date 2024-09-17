package com.concierge.apiconcierge.controllers.version1.user;

import com.concierge.apiconcierge.dtos.user.UserDto;
import com.concierge.apiconcierge.models.user.User;
import com.concierge.apiconcierge.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user/add")
public class PostAddUserController {

    @Autowired
    UserRepository repository;

    @PostMapping
    public ResponseEntity<Object> addUser(@RequestBody @Valid UserDto data){

        if (this.repository.findByEmail(data.email()) != null) return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists.");

        User user = new User();
        BeanUtils.copyProperties(data, user);

        String encryptedPassword = new BCryptPasswordEncoder(12).encode(data.password());
        user.setPassword(encryptedPassword);

        this.repository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
