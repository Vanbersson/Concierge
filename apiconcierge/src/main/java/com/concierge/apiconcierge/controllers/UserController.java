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
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ResaleRepository resaleRepository;

    @PostMapping("/add")
    public ResponseEntity<Object> addUser(@RequestBody @Valid UserDto data) {

        User user0 = userRepository.findByLogin(data.login());

        //Validation
        if (user0 != null) return ResponseEntity.status(HttpStatus.CONFLICT).body("Login already exists.");

        User user = new User();
        BeanUtils.copyProperties(data, user);

        return ResponseEntity.status(HttpStatus.CREATED).body(userRepository.save(user));

    }

    @PostMapping("/update")
    public ResponseEntity<Object> updateUser(@RequestBody @Valid UserDto data) {

        User user0 = userRepository.findByCompanyIdAndResaleIdAndId(data.companyId(), data.resaleId(), data.id());

        if (user0 == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        User user = new User();
        BeanUtils.copyProperties(data, user);

        return ResponseEntity.status(HttpStatus.OK).body(userRepository.save(user));
    }

    @GetMapping("/all/{companyid}/{resaleid}")
    public ResponseEntity<List<User>> allUser(@PathVariable(value = "companyid") Integer companyId, @PathVariable(value = "resaleid") Integer resaleId) {
        List<User> users = userRepository.findByCompanyIdAndResaleId(companyId, resaleId);

        return ResponseEntity.ok(users);

    }

}
