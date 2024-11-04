package com.concierge.apiconcierge.controllers.version1;

import com.concierge.apiconcierge.dtos.auth.AuthResponseDto;
import com.concierge.apiconcierge.dtos.auth.AuthenticationDto;
import com.concierge.apiconcierge.dtos.auth.TokenDto;
import com.concierge.apiconcierge.dtos.auth.TokenValidDto;
import com.concierge.apiconcierge.models.user.User;
import com.concierge.apiconcierge.repositories.UserRepository;
import com.concierge.apiconcierge.services.auth.TokenService;
import jakarta.servlet.http.HttpServletRequest;
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

import java.net.http.HttpHeaders;
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
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody @Valid AuthenticationDto data) {

        var userNamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());
        var auth = this.authenticationManager.authenticate(userNamePassword);

        var token = tokenService.generateToken((User) auth.getPrincipal());

        User user = this.userRepository.findByEmail(data.email());

        //Last Session
        user.setLastSession(new Date());
        this.userRepository.save(user);
        Map<String, Object> map = new HashMap<>();
        if(user.getPhoto() == null){
            map.put("photo","");
        }else{
            map.put("photo",user.getPhoto());
        }
        map.put("name",user.getName());
        map.put("roleDesc",user.getRoleDesc());
        map.put("token",token);

        return ResponseEntity.status(HttpStatus.OK).body(map);
    }

    @PostMapping("/validToken")
    public ResponseEntity<Object> validToken(){

        return ResponseEntity.ok().build();
    }

}
