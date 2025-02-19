package com.concierge.apiconcierge.controllers.clientcompany;

import com.concierge.apiconcierge.dtos.clientcompany.ClientCompanyTypeDto;
import com.concierge.apiconcierge.models.clientcompany.ClientCompanyType;
import com.concierge.apiconcierge.repositories.clientcompany.IClientCompanyTypeRepository;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/v1/{companyid}/{resaleid}/clientCompany/type")
public class ClientCompanyTypeController {

    @Autowired
    IClientCompanyTypeRepository typeRepository;

    @PostMapping("/add")
    public ResponseEntity<Object> addType(@PathVariable(name = "companyid") Integer companyId,
                                          @PathVariable(name = "resaleid") Integer resaleId,
                                          @RequestBody @Valid ClientCompanyTypeDto data) {

        ClientCompanyType type = new ClientCompanyType();
        BeanUtils.copyProperties(data, type);

        return ResponseEntity.status(HttpStatus.CREATED).body(typeRepository.save(type));

    }

    @PostMapping("/update")
    public ResponseEntity<Object> updateType(@PathVariable(name = "companyid") Integer companyId,
                                             @PathVariable(name = "resaleid") Integer resaleId,
                                             @RequestBody @Valid ClientCompanyTypeDto data) {

        Optional<ClientCompanyType> type0 = typeRepository.findById(data.id());

        if (type0.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        ClientCompanyType type = new ClientCompanyType();
        BeanUtils.copyProperties(data, type);

        return ResponseEntity.ok(typeRepository.save(type));


    }

    @GetMapping("/all")
    public ResponseEntity<List<ClientCompanyType>> allType(
            @PathVariable(name = "companyid") Integer companyId,
            @PathVariable(name = "resaleid") Integer resaleId) {

        List<ClientCompanyType> types = typeRepository.findByCompanyIdAndResaleId(companyId, resaleId);

        return ResponseEntity.ok(types);
    }

    @GetMapping("/filter/id/{id}")
    public ResponseEntity<Object> idType(
            @PathVariable(name = "id") Integer id,
            @PathVariable(name = "companyid") Integer companyId,
            @PathVariable(name = "resaleid") Integer resaleId) {

        ClientCompanyType type0 = typeRepository.findByCompanyIdAndResaleIdAndId(id, companyId, resaleId);

        if (type0 == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        return ResponseEntity.ok(type0);
    }

}
