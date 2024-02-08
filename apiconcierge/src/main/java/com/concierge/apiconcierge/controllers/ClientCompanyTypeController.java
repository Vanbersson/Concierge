package com.concierge.apiconcierge.controllers;

import com.concierge.apiconcierge.dtos.ClientCompanyTypeDto;
import com.concierge.apiconcierge.models.clientcompany.ClientCompanyType;
import com.concierge.apiconcierge.repositories.ClientCompanyTypeRepository;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/ClientCompany/type")
public class ClientCompanyTypeController {

    @Autowired
    ClientCompanyTypeRepository typeRepository;

    @PostMapping("/add")
    public ResponseEntity<Object> addType(@RequestBody @Valid ClientCompanyTypeDto data) {

        ClientCompanyType type = new ClientCompanyType();
        BeanUtils.copyProperties(data, type);

        return ResponseEntity.status(HttpStatus.CREATED).body(typeRepository.save(type));

    }

    @PostMapping("/update")
    public ResponseEntity<Object> updateType(@RequestBody @Valid ClientCompanyTypeDto data) {

        Optional<ClientCompanyType> type0 = typeRepository.findById(data.id());

        if (type0.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        ClientCompanyType type = new ClientCompanyType();
        BeanUtils.copyProperties(data, type);

        return ResponseEntity.ok(typeRepository.save(type));


    }

    @GetMapping("/all")
    public ResponseEntity<List<ClientCompanyType>> allType() {
        List<ClientCompanyType> types = typeRepository.findAll();

        if (types.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        return ResponseEntity.ok(types);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Object> idType(@PathVariable(name = "id") Integer id) {
        Optional<ClientCompanyType> type0 = typeRepository.findById(id);

        if (type0.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        return ResponseEntity.ok(type0);
    }

}
