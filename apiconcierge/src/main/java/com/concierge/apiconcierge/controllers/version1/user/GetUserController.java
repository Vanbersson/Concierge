package com.concierge.apiconcierge.controllers.version1.user;

import com.concierge.apiconcierge.dtos.user.UserDto;
import com.concierge.apiconcierge.dtos.user.UserResponseDto;
import com.concierge.apiconcierge.models.user.User;
import com.concierge.apiconcierge.repositories.UserRepository;
import com.concierge.apiconcierge.services.auth.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user/filter/token")
public class GetUserController {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserRepository repository;

    @GetMapping
    public ResponseEntity<Object> getUser(HttpServletRequest request) {

        String token = request.getHeader("Authorization").replace("Bearer ", "");
        String email = this.tokenService.validToken(token);

        if (email == "") return ResponseEntity.badRequest().build();

        User user = this.repository.findByEmail(email);

        Object ob = new UserResponseDto(
                user.getCompanyId(),
                user.getResaleId(),
                user.getId(),
                user.getStatus(),
                user.getName(),
                user.getEmail(),
                user.getCellphone(),
                user.getLimitDiscount(),
                user.getPhoto(),
                user.getRoleId(),
                user.getRoleDesc(),
                user.getRoleFunc());

        return ResponseEntity.ok(ob);

    }
}
