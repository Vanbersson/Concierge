package com.concierge.apiconcierge.controllers.clientcompany;

import com.concierge.apiconcierge.dtos.clientcompany.ClientCategoryDto;
import com.concierge.apiconcierge.models.clientcompany.ClientCategory;
import com.concierge.apiconcierge.repositories.clientcompany.IClientCategoryRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/clientcompany/category")
public class ClientCategoryController {

    @Autowired
    IClientCategoryRepository typeRepository;

    @PostMapping("/add")
    public ResponseEntity<Object> save(@RequestBody ClientCategoryDto data) {

        ClientCategory type = new ClientCategory();
        BeanUtils.copyProperties(data, type);

        return ResponseEntity.status(HttpStatus.CREATED).body(typeRepository.save(type));
    }

    @PostMapping("/update")
    public ResponseEntity<Object> update(@RequestBody ClientCategoryDto data) {

        Optional<ClientCategory> type0 = typeRepository.findById(data.id());

        if (type0.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        ClientCategory type = new ClientCategory();
        BeanUtils.copyProperties(data, type);

        return ResponseEntity.ok(typeRepository.save(type));


    }

    @GetMapping("/{companyId}/{resaleId}/filter/all")
    public ResponseEntity<List<ClientCategory>> listAll(
            @PathVariable(name = "companyId") Integer companyId,
            @PathVariable(name = "resaleId") Integer resaleId) {

        List<ClientCategory> types = typeRepository.listAll(companyId, resaleId);

        return ResponseEntity.ok(types);
    }

    @GetMapping("/{companyId}/{resaleId}/filter/id/{id}")
    public ResponseEntity<Object> filterId(@PathVariable(name = "companyId") Integer companyId,
                                           @PathVariable(name = "resaleId") Integer resaleId,
                                           @PathVariable(name = "id") Integer id) {
        ClientCategory type0 = typeRepository.filterId(companyId, resaleId, id);

        if (type0 == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        return ResponseEntity.ok(type0);
    }

}
