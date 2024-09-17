package com.concierge.apiconcierge.controllers.version1.clientcompany;

import com.concierge.apiconcierge.dtos.clientcompany.ClientCompanyDto;
import com.concierge.apiconcierge.dtos.clientcompany.ClientCompanyUpdateDto;
import com.concierge.apiconcierge.models.clientcompany.ClientCompany;
import com.concierge.apiconcierge.models.clientcompany.ClientCompanyType;
import com.concierge.apiconcierge.models.clientcompany.CliForEnum;
import com.concierge.apiconcierge.models.clientcompany.FisJurEnum;
import com.concierge.apiconcierge.repositories.clientcompany.ClientCompanyIRepository;
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
    private ClientCompanyIRepository clientIRepository;

    @PostMapping("/save")
    public ResponseEntity<Object> saveClientCompany(@RequestBody @Valid ClientCompanyDto data) {

        if (data.fisjur() == FisJurEnum.Juridica) {

            ClientCompany client0 = this.clientIRepository.findByCnpj(data.cnpj());

            if (client0 != null) return ResponseEntity.status(HttpStatus.CONFLICT).body("CNPJ already exists.");

            ClientCompany clientCompany = new ClientCompany();
            BeanUtils.copyProperties(data, clientCompany);

            clientCompany.setCpf("");
            clientCompany.setRg("");

            this.clientIRepository.save(clientCompany);

            return ResponseEntity.status(HttpStatus.CREATED).build();

        }

        if (data.fisjur() == FisJurEnum.Fisica) {

            ClientCompany client0 = this.clientIRepository.findByCpf(data.cpf());

            if (client0 != null) return ResponseEntity.status(HttpStatus.CONFLICT).body("CPF already exists.");

            ClientCompany client1 = clientIRepository.findByRg(data.rg());

            if (client1 != null) return ResponseEntity.status(HttpStatus.CONFLICT).body("RG already exists.");

            ClientCompany clientCompany = new ClientCompany();
            BeanUtils.copyProperties(data, clientCompany);

            clientCompany.setCnpj("");

            this.clientIRepository.save(clientCompany);

            return ResponseEntity.status(HttpStatus.CREATED).build();

        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/update")
    public ResponseEntity<Object> updateClientCompany(@RequestBody @Valid ClientCompanyUpdateDto data) {
        Optional<ClientCompany> client0 = this.clientIRepository.findById(data.id());

        if (client0.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        ClientCompany client = client0.get();
        BeanUtils.copyProperties(data, client);

        this.clientIRepository.save(client);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/filter/id/{id}")
    public ResponseEntity<Object> getIdClientCompany(@PathVariable(name = "id") Integer id) {
        Optional<ClientCompany> company = clientIRepository.findById(id);
        if (company.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        return ResponseEntity.ok().body(company);
    }


    //Juridica
    @GetMapping("/filter/j/fantasia/{fantasia}")
    public ResponseEntity<List<ClientCompany>> getJFantasia(@PathVariable(name = "fantasia") String fantasia) {
        List<ClientCompany> companies = this.clientIRepository.findFantasia(1, fantasia);
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/filter/j/name/{name}")
    public ResponseEntity<List<ClientCompany>> getJName(@PathVariable(name = "name") String name) {
        List<ClientCompany> companies = this.clientIRepository.findName(1, name);
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/filter/cnpj/{cnpj}")
    public ResponseEntity<ClientCompany> getCnpj(@PathVariable(name = "cnpj") String cnpj) {
        ClientCompany company = this.clientIRepository.findByCnpj(cnpj);
        if (company == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        return ResponseEntity.ok().body(company);
    }

    //Física
    @GetMapping("/filter/f/fantasia/{fantasia}")
    public ResponseEntity<List<ClientCompany>> getFFantasia(@PathVariable(name = "fantasia") String fantasia) {
        List<ClientCompany> companies = this.clientIRepository.findFantasia(0, fantasia);
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/filter/f/name/{name}")
    public ResponseEntity<List<ClientCompany>> getFName(@PathVariable(name = "name") String name) {
        List<ClientCompany> companies = this.clientIRepository.findName(0, name);
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/filter/cpf/{cpf}")
    public ResponseEntity<ClientCompany> getCpf(@PathVariable(name = "cpf") String cpf) {
        ClientCompany company = this.clientIRepository.findByCpf(cpf);
        if (company == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        return ResponseEntity.ok().body(company);
    }

    @GetMapping("/filter/rg/{rg}")
    public ResponseEntity<ClientCompany> getRg(@PathVariable(name = "cnpj") String cnpj) {
        ClientCompany company = this.clientIRepository.findByCnpj(cnpj);
        if (company == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        return ResponseEntity.ok().body(company);
    }

}
