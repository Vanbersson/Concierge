package com.concierge.apiconcierge.controllers;

import com.concierge.apiconcierge.dtos.ResaleDto;
import com.concierge.apiconcierge.dtos.UserDto;
import com.concierge.apiconcierge.models.companies.Company;
import com.concierge.apiconcierge.models.resales.Resale;
import com.concierge.apiconcierge.models.user.User;
import com.concierge.apiconcierge.repositories.CompanyRepository;
import com.concierge.apiconcierge.repositories.ResaleRepository;
import com.concierge.apiconcierge.repositories.UserRepository;
import com.concierge.apiconcierge.repositories.UserRoleRepository;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user/resale/{resaleId}")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ResaleRepository resaleRepository;

    @PostMapping("/add")
    public ResponseEntity<Object> addUser(@PathVariable(value = "resaleId") Integer resaleId, @RequestBody @Valid UserDto data) {

        //Validation
        if (resaleId != data.resaleId()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        
        //Validation
        if (!validResale(resaleId)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        User user0 = userRepository.findByLogin(data.login());

        //Validation
        if (user0 != null) return ResponseEntity.status(HttpStatus.CONFLICT).body("Login already exists.");


        User user = new User();
        BeanUtils.copyProperties(data, user);

        return ResponseEntity.status(HttpStatus.CREATED).body(userRepository.save(user));

    }

    @PostMapping("/update")
    public ResponseEntity<Object> updateUser(@PathVariable(value = "resaleId") Integer resaleId, @RequestBody @Valid UserDto data) {

        //Validation
        if (resaleId != data.resaleId()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        //Validation
        if (!validResale(resaleId)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Optional<User> user0 = userRepository.findById(data.id());

        if (user0.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        User user = new User();
        BeanUtils.copyProperties(data, user);

        return ResponseEntity.status(HttpStatus.OK).body(userRepository.save(user));
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> allUser(@PathVariable(value = "resaleId") Integer resaleId) {
        List<User> users = userRepository.findByResaleId(resaleId);

        if (users.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        return ResponseEntity.ok(users);

    }

    private Boolean validResale(Integer resaleId) {
        var resele = resaleRepository.findById(resaleId);

        return resele.isPresent();
    }
}
