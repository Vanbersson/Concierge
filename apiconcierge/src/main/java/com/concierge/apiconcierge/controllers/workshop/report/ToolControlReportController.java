package com.concierge.apiconcierge.controllers.workshop.report;

import com.concierge.apiconcierge.dtos.message.MessageResponseDto;
import com.concierge.apiconcierge.services.workshop.report.ToolControlReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/workshop/tool/control/report")
public class ToolControlReportController {

    @Autowired
    ToolControlReportService service;

    @GetMapping("/{companyId}/{resaleId}/all/filter/{mechanicId}/mec")
    public ResponseEntity<Object> filterMec(@PathVariable(name = "companyId") Integer companyId,
                                                     @PathVariable(name = "resaleId") Integer resaleId,
                                                     @PathVariable(name = "mechanicId") Integer mechanicId) {
        try {
            Map<String, Object> result = this.service.filterMechanic(companyId, resaleId, mechanicId);
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

}
