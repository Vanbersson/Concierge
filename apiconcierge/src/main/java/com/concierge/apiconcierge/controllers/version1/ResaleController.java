package com.concierge.apiconcierge.controllers.version1;

import com.concierge.apiconcierge.dtos.CompanyDto;
import com.concierge.apiconcierge.dtos.ResaleDto;
import com.concierge.apiconcierge.models.companies.Company;
import com.concierge.apiconcierge.models.resales.Resale;
import com.concierge.apiconcierge.repositories.CompanyRepository;
import com.concierge.apiconcierge.repositories.ResaleRepository;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/resale")
public class ResaleController {

    @Autowired
    ResaleRepository resaleRepository;

    @Autowired
    CompanyRepository companyRepository;

    @PostMapping("/add")
    public ResponseEntity<Object> addResale(@RequestBody @Valid ResaleDto data) {

        //Validation
        if (data.cnpj().length() != 14) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        //Validation
        if (!validCompany(data.companyId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Resale resale0 = resaleRepository.findByCompanyIdAndCnpj(data.companyId(), data.cnpj());
        //Validation
        if (resale0 != null) return ResponseEntity.status(HttpStatus.CONFLICT).body("Resale already exists.");

        Resale resale = new Resale();
        BeanUtils.copyProperties(data, resale);

        return ResponseEntity.status(HttpStatus.CREATED).body(resaleRepository.save(resale));

    }

    @PostMapping("/update")
    public ResponseEntity<Object> updateResale(@PathVariable(value = "companyId") Integer companyId, @RequestBody @Valid ResaleDto data) {

        //Validation
        if (!validCompany(companyId)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Resale resale = resaleRepository.findByCompanyIdAndId(companyId, data.id());
        //Validation
        if (companyId != data.companyId()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        if (resale == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        BeanUtils.copyProperties(data, resale);

        return ResponseEntity.status(HttpStatus.OK).body(resaleRepository.save(resale));
    }

    @GetMapping("/all/company/{id}")
    public ResponseEntity<List<Resale>> allResale(@PathVariable(value = "id") Integer companyId) {

        List<Resale> resales = resaleRepository.findByCompanyId(companyId);

        if (resales.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        return ResponseEntity.ok(resales);

    }

    @GetMapping("/cnpj/{cnpj}")
    public ResponseEntity<Object> cnpjResale(@PathVariable(value = "cnpj") String cnpj) {

        Resale resale0 = resaleRepository.findByCnpj(cnpj);

        if (resale0 == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        return ResponseEntity.ok(resale0);

    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Object> idResale(@PathVariable(value = "id") Integer id) {
        Optional<Resale> resale0 = resaleRepository.findById(id);

        if (resale0.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        return ResponseEntity.ok(resale0);

    }

    private Boolean validCompany(Integer companyId) {
        var company = companyRepository.findById(companyId);

        return company.isPresent();
    }


}
