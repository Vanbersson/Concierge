package com.concierge.apiconcierge.controllers.version1.user;

import com.concierge.apiconcierge.dtos.user.UserDto;
import com.concierge.apiconcierge.models.user.User;
import com.concierge.apiconcierge.repositories.UserRepository;
import com.concierge.apiconcierge.services.auth.TokenService;
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
@RequestMapping("/user/update")
public class PostUpdateUserController {
    @Autowired
    UserRepository repository;

    @Autowired
    TokenService tokenService;

    @PostMapping
    public ResponseEntity<Object> updateUser(@RequestBody @Valid UserDto data) {

        User user = this.repository.findByEmail(data.email());

        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        BCryptPasswordEncoder bCrypt = new BCryptPasswordEncoder(12);

        String password = user.getPassword();

        if (!bCrypt.matches(data.password(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        BeanUtils.copyProperties(data,user);
        user.setPassword(password);

        this.repository.save(user);

        return ResponseEntity.ok().build();
    }
}
