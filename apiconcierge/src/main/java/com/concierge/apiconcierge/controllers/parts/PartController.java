package com.concierge.apiconcierge.controllers.parts;

import com.concierge.apiconcierge.dtos.message.MessageResponseDto;
import com.concierge.apiconcierge.dtos.parts.PartDto;
import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.part.Part;
import com.concierge.apiconcierge.services.parts.IPartService;
import com.concierge.apiconcierge.services.parts.interfaces.IPartListAll;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/part")
public class PartController {

    @Autowired
    private IPartService service;

    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody PartDto data) {
        try {
            Part part = new Part();
            BeanUtils.copyProperties(data, part);
            MessageResponse response = this.service.save(part);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @PostMapping("/update")
    public ResponseEntity<Object> update(@RequestBody PartDto data) {
        try {
            Part parts = new Part();
            BeanUtils.copyProperties(data, parts);
            MessageResponse response = this.service.update(parts);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/{companyId}/{resaleId}/list/all")
    public ResponseEntity<Object> listAll(@PathVariable(name = "companyId") Integer companyId,
                                          @PathVariable(name = "resaleId") Integer resaleId) {
        try {
            List<Map<String, Object>> parts = this.service.listAll(companyId, resaleId);
            return ResponseEntity.status(HttpStatus.OK).body(parts);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }


}
