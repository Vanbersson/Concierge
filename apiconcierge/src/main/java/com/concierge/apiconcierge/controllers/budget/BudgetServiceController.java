package com.concierge.apiconcierge.controllers.budget;

import com.concierge.apiconcierge.dtos.budget.BudgetServiceDto;
import com.concierge.apiconcierge.dtos.message.MessageResponseDto;
import com.concierge.apiconcierge.models.budget.BudgetService;
import com.concierge.apiconcierge.services.budget.service.IBudgetServiceService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehicle/entry/budget/service")
public class BudgetServiceController {

    @Autowired
    private IBudgetServiceService service;

    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody BudgetServiceDto data) {
        try {
            BudgetService budgetService = new BudgetService();
            BeanUtils.copyProperties(data, budgetService);
            String message = this.service.save(budgetService);
            return ResponseEntity.status(HttpStatus.CREATED).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @PostMapping("/update")
    public ResponseEntity<Object> update(@RequestBody BudgetServiceDto data) {
        try {
            BudgetService budgetService = new BudgetService();
            BeanUtils.copyProperties(data, budgetService);
            String message = this.service.update(budgetService);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/{companyId}/{resaleId}/filter/butget/{butgetId}")
    public ResponseEntity<Object> listServices(@PathVariable(name = "companyId") Integer companyId,
                                               @PathVariable(name = "resaleId") Integer resaleId,
                                               @PathVariable(name = "butgetId") Integer butgetId) {
        try {
            List<BudgetService> list = this.service.listServices(companyId, resaleId, butgetId);
            return ResponseEntity.status(HttpStatus.OK).body(list);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<Object> delete(@RequestBody BudgetServiceDto data) {
        try {
            BudgetService budgetService = new BudgetService();
            BeanUtils.copyProperties(data, budgetService);
            String message = this.service.delete(budgetService);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @PostMapping("/delete/all/discount")
    public ResponseEntity<Object> deleteAllDiscount(@RequestBody BudgetServiceDto data) {
        try {
            BudgetService budgetService = new BudgetService();
            BeanUtils.copyProperties(data, budgetService);
            String message = this.service.deleteAllDiscount(budgetService);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }


}
