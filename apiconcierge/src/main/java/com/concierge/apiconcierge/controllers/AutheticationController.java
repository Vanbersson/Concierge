package com.concierge.apiconcierge.controllers;

import com.concierge.apiconcierge.dtos.AuthenticationDto;
import com.concierge.apiconcierge.models.user.User;
import com.concierge.apiconcierge.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AutheticationController {

    @Autowired
    UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody @Valid AuthenticationDto data){

        User user = userRepository.findByLogin(data.login());

        //Valid
        if(user == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        //Valid
        if(!data.password().equals(user.getPassword())){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.status(HttpStatus.OK).body(user);
    }
}
