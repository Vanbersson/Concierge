package com.concierge.apiconcierge.controllers.parts;


import com.concierge.apiconcierge.dtos.message.MessageResponseDto;
import com.concierge.apiconcierge.dtos.parts.PartDto;
import com.concierge.apiconcierge.models.part.Part;
import com.concierge.apiconcierge.services.parts.PartService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/part")
public class PartController {

    @Autowired
    private PartService service;

    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody PartDto data) {
        try {
            Part part = new Part();
            BeanUtils.copyProperties(data, part);
            Integer id = this.service.save(part);

            Map<String, Object> map = new HashMap<>();
            map.put("id", id);
            return ResponseEntity.status(HttpStatus.CREATED).body(map);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @PostMapping("/update")
    public ResponseEntity<Object> update(@RequestBody PartDto data) {
        try {
            Part parts = new Part();
            BeanUtils.copyProperties(data, parts);
            String message = this.service.update(parts);

            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/{companyId}/{resaleId}/filter/all")
    public ResponseEntity<Object> listAll(@PathVariable(name = "companyId") Integer companyId,
                                          @PathVariable(name = "resaleId") Integer resaleId) {
        try {
            List<Part> parts = this.service.listAll(companyId, resaleId);
            return ResponseEntity.status(HttpStatus.OK).body(parts);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }


}
