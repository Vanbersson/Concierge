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

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user/filter/token")
public class GetUserController {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserRepository repository;

    @GetMapping
    public ResponseEntity<Object> userToken(HttpServletRequest request) {

        String token = request.getHeader("Authorization").replace("Bearer ", "");
        String email = this.tokenService.validToken(token);

        if (email.isBlank()) return ResponseEntity.badRequest().build();

        User user = this.repository.findByEmail(email);
        Map<String, Object> map = new HashMap<>();

        map.put("companyId", user.getCompanyId());
        map.put("resaleId", user.getResaleId());
        map.put("id", user.getId());
        map.put("status", user.getStatus());
        map.put("name", user.getName());
        map.put("email", user.getEmail());
        map.put("cellphone", user.getCellphone());
        if (user.getLimitDiscount() == null) {
            map.put("limitDiscount", 0);
        } else {
            map.put("limitDiscount", user.getLimitDiscount());
        }
        if (user.getPhoto() == null) {
            map.put("photo", "");
        } else {
            map.put("photo", user.getPhoto());
        }
        map.put("roleId", user.getRoleId());
        map.put("roleDesc", user.getRoleDesc());
        map.put("roleFunc", user.getRoleFunc());

        return ResponseEntity.ok(map);

    }
}
