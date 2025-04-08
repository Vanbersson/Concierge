package com.concierge.apiconcierge.controllers.auth;

import com.concierge.apiconcierge.dtos.auth.AuthenticationDto;
import com.concierge.apiconcierge.models.user.User;
import com.concierge.apiconcierge.repositories.user.IUserRepository;
import com.concierge.apiconcierge.services.auth.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AutheticationController {

    @Autowired
    TokenService tokenService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private IUserRepository repository;

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody @Valid AuthenticationDto data) {

        var userNamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());
        var auth = this.authenticationManager.authenticate(userNamePassword);

        var token = tokenService.generateToken((User) auth.getPrincipal());

        User user = this.repository.loginEmail(data.email());

        //Last Session
        user.setLastSession(new Date());

        this.repository.save(user);
        Map<String, Object> map = new HashMap<>();

        map.put("companyId", user.getCompanyId());
        map.put("resaleId", user.getResaleId());
        map.put("id", user.getId());
        map.put("name", user.getName());
        map.put("roleDesc", user.getRoleDesc());
        map.put("cellphone", user.getCellphone());
        map.put("limitDiscount", user.getLimitDiscount());
        map.put("token", token);
        if (user.getPhoto() == null) {
            map.put("photo", "");
        } else {
            map.put("photo", user.getPhoto());
        }

        return ResponseEntity.status(HttpStatus.OK).body(map);
    }

}
