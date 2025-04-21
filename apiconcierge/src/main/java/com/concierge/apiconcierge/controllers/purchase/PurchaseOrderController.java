package com.concierge.apiconcierge.controllers.purchase;

import com.concierge.apiconcierge.dtos.message.MessageResponseDto;
import com.concierge.apiconcierge.dtos.purchase.PurchaseOrderDto;
import com.concierge.apiconcierge.models.purchase.PurchaseOrder;
import com.concierge.apiconcierge.services.purchase.PurchaseOrderService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/purchase/order")
public class PurchaseOrderController {

    @Autowired
    PurchaseOrderService service;


    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody PurchaseOrderDto data) {
        try {
            PurchaseOrder purchaseOrder = new PurchaseOrder();
            BeanUtils.copyProperties(data, purchaseOrder);

            Integer id = this.service.save(purchaseOrder);
            Map<String, Object> map = new HashMap<>();
            map.put("id", id);
            return ResponseEntity.status(HttpStatus.CREATED).body(map);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @PostMapping("/update")
    public ResponseEntity<Object> update(@RequestBody PurchaseOrderDto data) {
        try {
            PurchaseOrder purchaseOrder = new PurchaseOrder();
            BeanUtils.copyProperties(data, purchaseOrder);

            String message = this.service.update(purchaseOrder);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/{companyId}/{resaleId}/filter/open")
    public ResponseEntity<Object> filterOpen(@PathVariable(name = "companyId") Integer companyId,
                                             @PathVariable(name = "resaleId") Integer resaleId) {
        try {
            List<Map<String, Object>> purchases = this.service.filterOpen(companyId, resaleId);
            return ResponseEntity.status(HttpStatus.OK).body(purchases);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/{companyId}/{resaleId}/filter/id/{purchaseId}")
    public ResponseEntity<Object> filterId(@PathVariable(name = "companyId") Integer companyId,
                                           @PathVariable(name = "resaleId") Integer resaleId,
                                           @PathVariable(name = "purchaseId") Integer purchaseId) {
        try {
            Map<String, Object> map = this.service.filterId(companyId, resaleId, purchaseId);
            return ResponseEntity.status(HttpStatus.OK).body(map);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }
}
