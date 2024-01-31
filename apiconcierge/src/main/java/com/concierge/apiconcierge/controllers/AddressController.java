package com.concierge.apiconcierge.controllers;

import com.concierge.apiconcierge.dtos.AddressDto;
import com.concierge.apiconcierge.models.address.Address;
import com.concierge.apiconcierge.repositories.AddressRepository;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/address")
public class AddressController {

    @Autowired
    AddressRepository addressRepository;

    @PostMapping("/add")
    public ResponseEntity<Object> addAddress(@RequestBody @Valid AddressDto data) {
        Address address0 = addressRepository.findByCep(data.cep());

        if (address0 != null) return ResponseEntity.status(HttpStatus.CONFLICT).body("Address exists.");

        Address address = new Address();
        BeanUtils.copyProperties(data, address);

        return ResponseEntity.status(HttpStatus.CREATED).body(addressRepository.save(address));
    }
}
