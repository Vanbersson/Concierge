package com.concierge.apiconcierge.controllers;

import com.concierge.apiconcierge.dtos.ClientCompanyDto;
import com.concierge.apiconcierge.models.clientcompany.ClientCompany;
import com.concierge.apiconcierge.models.clientcompany.ClientCompanyType;
import com.concierge.apiconcierge.models.clientcompany.ClientCompanyTypeEnum;
import com.concierge.apiconcierge.repositories.ClientCompanyRepository;
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
@RequestMapping("/ClientCompany")
public class ClientCompanyController {

    @Autowired
    ClientCompanyRepository clientRepository;

    @Autowired
    ClientCompanyTypeRepository typeRepository;

    @PostMapping("/add")
    public ResponseEntity<Object> addClientCompany(@RequestBody @Valid ClientCompanyDto data) {

        Optional<ClientCompanyType> type0 = typeRepository.findById(data.typeId());

        if (type0.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        if (type0.get().getType() == ClientCompanyTypeEnum.PJ) {

            ClientCompany client0 = clientRepository.findByResaleIdAndCnpj(data.resaleId(), data.cnpj());

            if (client0 != null)
                return ResponseEntity.status(HttpStatus.CONFLICT).body("CNPJ already exists.");

            ClientCompany clientCompany = new ClientCompany();
            BeanUtils.copyProperties(data, clientCompany);

            clientCompany.setCpf("");
            clientCompany.setRg("");

            return ResponseEntity.status(HttpStatus.CREATED).body(clientRepository.save(clientCompany));

        }

        if (type0.get().getType() == ClientCompanyTypeEnum.PF) {

            ClientCompany client0 = clientRepository.findByResaleIdAndCpf(data.resaleId(), data.cpf());

            if (client0 != null)
                return ResponseEntity.status(HttpStatus.CONFLICT).body("CPF already exists.");

            ClientCompany client1 = clientRepository.findByResaleIdAndRg(data.resaleId(), data.rg());

            if (client1 != null)
                return ResponseEntity.status(HttpStatus.CONFLICT).body("RG already exists.");

            ClientCompany clientCompany = new ClientCompany();
            BeanUtils.copyProperties(data, clientCompany);

            clientCompany.setCnpj("");

            return ResponseEntity.status(HttpStatus.CREATED).body(clientRepository.save(clientCompany));

        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/update")
    public ResponseEntity<Object> updateClientCompany(@RequestBody @Valid ClientCompanyDto data){
      ClientCompany client =  clientRepository.findByResaleIdAndId(data.resaleId(), data.id());

      if(client == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

      BeanUtils.copyProperties(data,client);

      return ResponseEntity.ok(clientRepository.save(client));
    }

    @GetMapping("/resale/{resaleid}/id/{id}")
    public ResponseEntity<Object> idClientCompany(@PathVariable(name = "resaleid") Integer resaleid,@PathVariable(name = "id") Integer id) {

        ClientCompany company = clientRepository.findByResaleIdAndId(resaleid,id);

        if (company == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        return ResponseEntity.ok(company);
    }

    @GetMapping("/resale/{resaleid}/all")
    public ResponseEntity<List<ClientCompany>> allClientCompany(@PathVariable(name = "resaleid") Integer resaleid) {

        List<ClientCompany> companies = clientRepository.findByResaleId(resaleid);

        if (companies.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        return ResponseEntity.ok(companies);
    }

}
