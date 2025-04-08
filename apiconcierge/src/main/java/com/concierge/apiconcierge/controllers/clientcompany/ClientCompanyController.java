package com.concierge.apiconcierge.controllers.clientcompany;

import com.concierge.apiconcierge.dtos.message.MessageResponseDto;
import com.concierge.apiconcierge.dtos.clientcompany.ClientCompanyDto;
import com.concierge.apiconcierge.models.clientcompany.ClientCompany;
import com.concierge.apiconcierge.repositories.clientcompany.IClientCompanyRepository;
import com.concierge.apiconcierge.services.clientcompany.ClientCompanyService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/clientcompany")
public class ClientCompanyController {

    @Autowired
    private IClientCompanyRepository clientIRepository;

    @Autowired
    private ClientCompanyService service;

    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody ClientCompanyDto data) {
        try {
            ClientCompany clientCompany = new ClientCompany();
            BeanUtils.copyProperties(data, clientCompany);
            Integer id = this.service.save(clientCompany);
            Map<String, Object> map = new HashMap<>();
            map.put("id", id);
            return ResponseEntity.status(HttpStatus.CREATED).body(map);

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @PostMapping("/update")
    public ResponseEntity<Object> update(@RequestBody ClientCompanyDto data) {
        try {
            ClientCompany clientCompany = new ClientCompany();
            BeanUtils.copyProperties(data, clientCompany);

            String message = this.service.update(clientCompany);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/{companyId}/{resaleId}/filter/all")
    public ResponseEntity<Object> all(@PathVariable(name = "companyId") Integer companyId,
                                      @PathVariable(name = "resaleId") Integer resaleId) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(this.service.listAll(companyId, resaleId));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/{companyId}/{resaleId}/filter/id/{id}")
    public ResponseEntity<Object> filterId(@PathVariable(name = "companyId") Integer companyId,
                                           @PathVariable(name = "resaleId") Integer resaleId,
                                           @PathVariable(name = "id") Integer clientId) {
        try {
            ClientCompany client = this.service.filterId(companyId, resaleId, clientId);
            if (client == null)
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

            return ResponseEntity.status(HttpStatus.OK).body(client);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
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
