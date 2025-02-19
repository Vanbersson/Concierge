package com.concierge.apiconcierge.controllers.version1.parts;


import com.concierge.apiconcierge.dtos.message.MessageResponseDto;
import com.concierge.apiconcierge.dtos.parts.PartsDto;
import com.concierge.apiconcierge.models.parts.Parts;
import com.concierge.apiconcierge.services.parts.PartsService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/parts")
public class PartsController {

    @Autowired
    private PartsService service;

    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody PartsDto data) {
        try {
            Parts parts = new Parts();
            BeanUtils.copyProperties(data, parts);
            Integer id = this.service.save(parts);

            Map<String, Object> map = new HashMap<>();
            map.put("id", id);

            return ResponseEntity.status(HttpStatus.CREATED).body(map);

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @PostMapping("/update")
    public ResponseEntity<Object> update(@RequestBody PartsDto data) {
        try {
            Parts parts = new Parts();
            BeanUtils.copyProperties(data, parts);
            Object ob = this.service.update(parts);

            return ResponseEntity.status(HttpStatus.OK).body(ob);

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/filter/all")
    public ResponseEntity<Object> all() {
        try {
            List<Parts> parts = this.service.filterAll();
            return ResponseEntity.status(HttpStatus.OK).body(parts);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/filter/budget/{id}")
    public ResponseEntity<Object> budgetAll(@PathVariable(name = "id") Integer id) {
        try {
            List<Parts> parts = this.service.filterAll();
            return ResponseEntity.status(HttpStatus.OK).body(parts);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }



}
