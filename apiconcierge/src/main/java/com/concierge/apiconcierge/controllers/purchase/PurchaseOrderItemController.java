package com.concierge.apiconcierge.controllers.purchase;

import com.concierge.apiconcierge.dtos.message.MessageResponseDto;
import com.concierge.apiconcierge.dtos.purchase.PurchaseOrderItemDto;
import com.concierge.apiconcierge.models.purchase.PurchaseOrderItem;
import com.concierge.apiconcierge.services.purchase.item.PurchaseOrderItemService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/purchase/order/item")
public class PurchaseOrderItemController {

    @Autowired
    PurchaseOrderItemService service;

    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody PurchaseOrderItemDto data) {
        try {
            PurchaseOrderItem item = new PurchaseOrderItem();
            BeanUtils.copyProperties(data, item);
            String message = this.service.save(item);
            return ResponseEntity.status(HttpStatus.CREATED).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @PostMapping("/update")
    public ResponseEntity<Object> update(@RequestBody PurchaseOrderItemDto data) {
        try {
            PurchaseOrderItem item = new PurchaseOrderItem();
            BeanUtils.copyProperties(data, item);
            String message = this.service.update(item);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<Object> delete(@RequestBody PurchaseOrderItemDto data) {
        try {
            PurchaseOrderItem item = new PurchaseOrderItem();
            BeanUtils.copyProperties(data, item);
            String message = this.service.delete(item);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/{companyId}/{resaleId}/filter/purchase/{id}")
    public ResponseEntity<Object> filterPurchaseId(@PathVariable(name = "companyId") Integer companyId,
                                                   @PathVariable(name = "resaleId") Integer resaleId,
                                                   @PathVariable(name = "id") Integer purchaseId) {
        try {
            List<PurchaseOrderItem> list = this.service.filterId(companyId, resaleId, purchaseId);
            return ResponseEntity.status(HttpStatus.OK).body(list);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }
}
