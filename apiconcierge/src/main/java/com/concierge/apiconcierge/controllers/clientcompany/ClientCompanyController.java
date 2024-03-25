package com.concierge.apiconcierge.controllers.clientcompany;

import com.concierge.apiconcierge.dtos.clientcompany.ClientCompanyDto;
import com.concierge.apiconcierge.models.clientcompany.ClientCompany;
import com.concierge.apiconcierge.models.clientcompany.ClientCompanyType;
import com.concierge.apiconcierge.models.clientcompany.ClientCompanyTypeEnum;
import com.concierge.apiconcierge.repositories.clientcompany.ClientCompanyRepository;
import com.concierge.apiconcierge.repositories.clientcompany.ClientCompanyTypeRepository;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/clientcompany")
public class ClientCompanyController {

    @Autowired
    ClientCompanyRepository clientRepository;

    @Autowired
    ClientCompanyTypeRepository typeRepository;

    @PostMapping("/add")
    public ResponseEntity<Object> addClientCompany(@RequestBody @Valid ClientCompanyDto data) {

        ClientCompanyType type0 = typeRepository.findByCompanyIdAndResaleIdAndId(data.companyId(), data.resaleId(), data.typeId());

        if (type0 == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        if (type0.getType() == ClientCompanyTypeEnum.PJ) {

            ClientCompany client0 = clientRepository.findByCompanyIdAndResaleIdAndCnpj(data.companyId(), data.resaleId(), data.cnpj());

            if (client0 != null)
                return ResponseEntity.status(HttpStatus.CONFLICT).body("CNPJ already exists.");

            ClientCompany clientCompany = new ClientCompany();
            BeanUtils.copyProperties(data, clientCompany);

            clientCompany.setCpf("");
            clientCompany.setRg("");

            return ResponseEntity.status(HttpStatus.CREATED).body(clientRepository.save(clientCompany));

        }

        if (type0.getType() == ClientCompanyTypeEnum.PF) {

            ClientCompany client0 = clientRepository.findByCompanyIdAndResaleIdAndCpf(data.companyId(), data.resaleId(), data.cpf());

            if (client0 != null)
                return ResponseEntity.status(HttpStatus.CONFLICT).body("CPF already exists.");

            ClientCompany client1 = clientRepository.findByCompanyIdAndResaleIdAndRg(data.companyId(), data.resaleId(), data.rg());

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
    public ResponseEntity<Object> updateClientCompany(@RequestBody @Valid ClientCompanyDto data) {
        ClientCompany client = clientRepository.findByCompanyIdAndResaleIdAndId(data.companyId(), data.resaleId(), data.id());

        if (client == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        BeanUtils.copyProperties(data, client);

        return ResponseEntity.ok(clientRepository.save(client));
    }

    @GetMapping("/all/{companyid}/{resaleid}")
    public ResponseEntity<List<ClientCompany>> allClientCompany(
            @PathVariable(name = "companyid") Integer companyId,
            @PathVariable(name = "resaleid") Integer resaleId) {

        List<ClientCompany> companies = clientRepository.findByCompanyIdAndResaleId(companyId, resaleId);

        return ResponseEntity.ok(companies);
    }

}
