package com.concierge.apiconcierge.controllers.version1.user;

import com.concierge.apiconcierge.models.user.User;
import com.concierge.apiconcierge.repositories.UserRepository;
import com.concierge.apiconcierge.services.auth.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user/filter/email/{email}")
public class GetEmailUserController {

    @Autowired
    private UserRepository repository;

    @Autowired
    private TokenService tokenService;

    @GetMapping
    public ResponseEntity<User> getUserEmail(@PathVariable(value = "email") String email, HttpServletRequest request) {

        User user = repository.findByEmail(email);
        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        return ResponseEntity.ok(user);
    }
}
