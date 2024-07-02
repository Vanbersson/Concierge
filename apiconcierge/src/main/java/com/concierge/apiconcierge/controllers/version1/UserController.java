package com.concierge.apiconcierge.controllers.version1;

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
@RequestMapping("/v1/{companyid}/{resaleid}/user")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @PostMapping("/add")
    public ResponseEntity<Object> addUser(@PathVariable(value = "companyid") Integer companyId,
                                          @PathVariable(value = "resaleid") Integer resaleId,
                                          @RequestBody @Valid UserDto data) {

        User user0 = userRepository.findByEmail(data.email());

        //Validation
        if (user0 != null) return ResponseEntity.status(HttpStatus.CONFLICT).body("Login already exists.");

        User user = new User();
        BeanUtils.copyProperties(data, user);

        return ResponseEntity.status(HttpStatus.CREATED).body(userRepository.save(user));

    }

    @PostMapping("/update")
    public ResponseEntity<Object> updateUser(@PathVariable(value = "companyid") Integer companyId,
                                             @PathVariable(value = "resaleid") Integer resaleId,
                                             @RequestBody @Valid UserDto data) {

        User user0 = userRepository.findByCompanyIdAndResaleIdAndId(data.companyId(), data.resaleId(), data.id());

        if (user0 == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        User user = new User();
        BeanUtils.copyProperties(data, user);

        return ResponseEntity.status(HttpStatus.OK).body(userRepository.save(user));
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> allUser(@PathVariable(value = "companyid") Integer companyId,
                                              @PathVariable(value = "resaleid") Integer resaleId) {
        List<User> users = userRepository.findByCompanyIdAndResaleId(companyId, resaleId);

        return ResponseEntity.ok(users);

    }

    @GetMapping("/id/{userid}")
    public ResponseEntity<User> getUserId(@PathVariable(value = "companyid") Integer companyId,
                                          @PathVariable(value = "resaleid") Integer resaleId,
                                          @PathVariable(value = "userid") Integer userid) {

        User user = userRepository.findByCompanyIdAndResaleIdAndId(companyId, resaleId, userid);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(user);

    }

    @GetMapping("/role/{roleid}")
    public ResponseEntity<List<User>> getUserRole(@PathVariable(value = "companyid") Integer companyId,
                                                  @PathVariable(value = "resaleid") Integer resaleId,
                                                  @PathVariable(value = "roleid") Integer roleid) {

        List<User> users = userRepository.findByCompanyIdAndResaleIdAndRole(companyId, resaleId, roleid);


        return ResponseEntity.ok(users);

    }

}
