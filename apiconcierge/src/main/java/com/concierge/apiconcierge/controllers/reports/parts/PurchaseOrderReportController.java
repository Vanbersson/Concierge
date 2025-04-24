package com.concierge.apiconcierge.controllers.reports.parts;

import com.concierge.apiconcierge.dtos.message.MessageResponseDto;
import com.concierge.apiconcierge.dtos.reports.parts.PurchaseOrderReportDto;
import com.concierge.apiconcierge.services.reports.parts.PurchaseOrderReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/reports/parts/purchase/order")
public class PurchaseOrderReportController {

    @Autowired
    PurchaseOrderReportService service;


    @PostMapping("/filter")
    public ResponseEntity<Object> filter(@RequestBody PurchaseOrderReportDto data) {
        try {
            List<Object> list = this.service.filterPurchase(data);
            return ResponseEntity.status(HttpStatus.OK).body(list);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }
}
