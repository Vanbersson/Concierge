package com.concierge.apiconcierge.controllers.payment;

import com.concierge.apiconcierge.dtos.message.MessageResponseDto;
import com.concierge.apiconcierge.models.payment.TypePayment;
import com.concierge.apiconcierge.services.payment.TypePaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/payment")
public class TypePaymentController {

    @Autowired
    TypePaymentService service;

    @GetMapping("/{companyId}/{resaleId}/all")
    public ResponseEntity<Object> listAll(@PathVariable(name = "companyId") Integer companyId,
                                          @PathVariable(name = "resaleId") Integer resaleId) {
        try {
            List<TypePayment> result = this.service.listAll(companyId, resaleId);
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/{companyId}/{resaleId}/all/enabled")
    public ResponseEntity<Object> listAllEnabled(@PathVariable(name = "companyId") Integer companyId,
                                                 @PathVariable(name = "resaleId") Integer resaleId) {
        try {
            List<TypePayment> result = this.service.listAllEnabled(companyId, resaleId);
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }
}
