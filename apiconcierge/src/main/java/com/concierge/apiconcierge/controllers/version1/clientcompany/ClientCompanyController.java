package com.concierge.apiconcierge.controllers.version1.clientcompany;

import com.concierge.apiconcierge.dtos.clientcompany.ClientCompanyDto;
import com.concierge.apiconcierge.models.clientcompany.ClientCompany;
import com.concierge.apiconcierge.models.clientcompany.ClientCompanyType;
import com.concierge.apiconcierge.models.clientcompany.ClientCompanyTypeEnum;
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

@RestController
@RequestMapping("/v1/{companyid}/{resaleid}/clientCompany")
public class ClientCompanyController {

    @Autowired
    ClientCompanyIRepository clientIRepository;

    @Autowired
    ClientCompanyTypeRepository typeRepository;

    @Autowired
    ClientCompanyRepository companyRepository;

    @PostMapping("/add")
    public ResponseEntity<Object> addClientCompany(@PathVariable(name = "companyid") Integer companyId,
                                                   @PathVariable(name = "resaleid") Integer resaleId,
                                                   @RequestBody @Valid ClientCompanyDto data) {

        ClientCompanyType type0 = typeRepository.findByCompanyIdAndResaleIdAndId(data.companyId(), data.resaleId(), data.typeId());

        if (type0 == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        if (type0.getType() == ClientCompanyTypeEnum.PJ) {

            ClientCompany client0 = clientIRepository.findByCompanyIdAndResaleIdAndCnpj(data.companyId(), data.resaleId(), data.cnpj());

            if (client0 != null)
                return ResponseEntity.status(HttpStatus.CONFLICT).body("CNPJ already exists.");

            ClientCompany clientCompany = new ClientCompany();
            BeanUtils.copyProperties(data, clientCompany);

            clientCompany.setCpf("");
            clientCompany.setRg("");

            return ResponseEntity.status(HttpStatus.CREATED).body(clientIRepository.save(clientCompany));

        }

        if (type0.getType() == ClientCompanyTypeEnum.PF) {

            ClientCompany client0 = clientIRepository.findByCompanyIdAndResaleIdAndCpf(data.companyId(), data.resaleId(), data.cpf());

            if (client0 != null)
                return ResponseEntity.status(HttpStatus.CONFLICT).body("CPF already exists.");

            ClientCompany client1 = clientIRepository.findByCompanyIdAndResaleIdAndRg(data.companyId(), data.resaleId(), data.rg());

            if (client1 != null)
                return ResponseEntity.status(HttpStatus.CONFLICT).body("RG already exists.");

            ClientCompany clientCompany = new ClientCompany();
            BeanUtils.copyProperties(data, clientCompany);

            clientCompany.setCnpj("");

            return ResponseEntity.status(HttpStatus.CREATED).body(clientIRepository.save(clientCompany));

        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/update")
    public ResponseEntity<Object> updateClientCompany(@RequestBody @Valid ClientCompanyDto data) {
        ClientCompany client = clientIRepository.findByCompanyIdAndResaleIdAndId(data.companyId(), data.resaleId(), data.id());

        if (client == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        BeanUtils.copyProperties(data, client);

        return ResponseEntity.ok(clientIRepository.save(client));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ClientCompany>> allClientCompany(
            @PathVariable(name = "companyid") Integer companyId,
            @PathVariable(name = "resaleid") Integer resaleId) {

        List<ClientCompany> companies = clientIRepository.findByCompanyIdAndResaleId(companyId, resaleId);

        return ResponseEntity.ok(companies);
    }

    @GetMapping("/filter/name/{companyname}")
    public ResponseEntity<List<ClientCompany>> getListName(
            @PathVariable(name = "companyname") String name,
            @PathVariable(name = "companyid") Integer companyId,
            @PathVariable(name = "resaleid") Integer resaleId) {

        List<ClientCompany> companies = companyRepository.getListName(companyId, resaleId, name);

        return ResponseEntity.ok(companies);
    }

    @GetMapping("/filter/id/{code}")
    public ResponseEntity<List<ClientCompany>> getListId(
            @PathVariable(name = "code") Integer id,
            @PathVariable(name = "companyid") Integer companyId,
            @PathVariable(name = "resaleid") Integer resaleId) {

        List<ClientCompany> companies = companyRepository.getListId(companyId, resaleId, id);

        return ResponseEntity.ok(companies);
    }

    @GetMapping("/filter/cnpj/{cnpj}")
    public ResponseEntity<List<ClientCompany>> getListCnpj(
            @PathVariable(name = "cnpj") String cnpj,
            @PathVariable(name = "companyid") Integer companyId,
            @PathVariable(name = "resaleid") Integer resaleId) {

        List<ClientCompany> companies = companyRepository.getListCnpj(companyId, resaleId, cnpj);

        return ResponseEntity.ok(companies);
    }

    @GetMapping("/filter/cpf/{cpf}")
    public ResponseEntity<List<ClientCompany>> getListCpf(
            @PathVariable(name = "cpf") String cpf,
            @PathVariable(name = "companyid") Integer companyId,
            @PathVariable(name = "resaleid") Integer resaleId) {

        List<ClientCompany> companies = companyRepository.getListCpf(companyId, resaleId, cpf);

        return ResponseEntity.ok(companies);
    }

    @GetMapping("/filter/rg/{rg}")
    public ResponseEntity<List<ClientCompany>> getListRg(
            @PathVariable(name = "rg") String rg,
            @PathVariable(name = "companyid") Integer companyId,
            @PathVariable(name = "resaleid") Integer resaleId) {

        List<ClientCompany> companies = companyRepository.getListRg(companyId, resaleId, rg);

        return ResponseEntity.ok(companies);
    }

}
