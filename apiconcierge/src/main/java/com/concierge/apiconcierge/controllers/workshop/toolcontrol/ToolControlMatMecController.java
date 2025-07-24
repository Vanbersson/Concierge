package com.concierge.apiconcierge.controllers.workshop.toolcontrol;

import com.concierge.apiconcierge.dtos.message.MessageResponseDto;
import com.concierge.apiconcierge.dtos.workshop.toolcontrol.ToolControlMatMecDto;
import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMatMec;
import com.concierge.apiconcierge.services.workshop.matmec.ToolControlMatMecService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/workshop/tool/control/matmec")
public class ToolControlMatMecController {

    @Autowired
    ToolControlMatMecService service;

    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody ToolControlMatMecDto data) {
        try {
            ToolControlMatMec matMec = new ToolControlMatMec();
            BeanUtils.copyProperties(data, matMec);
            String message = this.service.save(matMec);
            return ResponseEntity.status(HttpStatus.CREATED).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @PostMapping("/update")
    public ResponseEntity<Object> update(@RequestBody ToolControlMatMecDto data) {
        try {
            ToolControlMatMec matMec = new ToolControlMatMec();
            BeanUtils.copyProperties(data, matMec);
            String message = this.service.update(matMec);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/{companyId}/{resaleId}/all/filter/{id}/id")
    public ResponseEntity<Object> filterId(@PathVariable(name = "companyId") Integer companyId,
                                           @PathVariable(name = "resaleId") Integer resaleId,
                                           @PathVariable(name = "id") UUID id) {
        try {
            Map<String, Object> result = this.service.filterId(companyId, resaleId, id);
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/{companyId}/{resaleId}/all/filter/{materialId}/mat")
    public ResponseEntity<Object> filterMatIdDevPend(@PathVariable(name = "companyId") Integer companyId,
                                                     @PathVariable(name = "resaleId") Integer resaleId,
                                                     @PathVariable(name = "materialId") Integer materialId) {
        try {
            List<Map<String, Object>> result = this.service.filterMatIdDevPend(companyId, resaleId, materialId);
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/{companyId}/{resaleId}/all/filter/{mechanicId}/mec")
    public ResponseEntity<Object> filterMecIdDevPend(@PathVariable(name = "companyId") Integer companyId,
                                                     @PathVariable(name = "resaleId") Integer resaleId,
                                                     @PathVariable(name = "mechanicId") Integer mechanicId) {
        try {
            List<Map<String, Object>> result = this.service.filterMecIdDevPend(companyId, resaleId, mechanicId);
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }


}
