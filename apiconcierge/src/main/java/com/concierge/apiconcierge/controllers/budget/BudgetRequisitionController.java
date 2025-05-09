package com.concierge.apiconcierge.controllers.budget;

import com.concierge.apiconcierge.dtos.budget.BudgetRequisitionDto;
import com.concierge.apiconcierge.dtos.message.MessageResponseDto;
import com.concierge.apiconcierge.models.budget.BudgetRequisition;
import com.concierge.apiconcierge.services.budget.requisition.IBudgetRequisitionService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehicle/entry/budget/requisition")
public class BudgetRequisitionController {

    @Autowired
    private IBudgetRequisitionService service;

    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody BudgetRequisitionDto data) {
        try {
            BudgetRequisition requisition = new BudgetRequisition();
            BeanUtils.copyProperties(data, requisition);

            String message = this.service.save(requisition);
            return ResponseEntity.status(HttpStatus.CREATED).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @PostMapping("/update")
    public ResponseEntity<Object> update(@RequestBody BudgetRequisitionDto data) {
        try {
            BudgetRequisition requisition = new BudgetRequisition();
            BeanUtils.copyProperties(data, requisition);

            String message = this.service.update(requisition);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/{companyId}/{resaleId}/filter/butget/{butgetid}")
    public ResponseEntity<Object> listAllRequisition(@PathVariable(name = "companyId") Integer companyId,
                                                     @PathVariable(name = "resaleId") Integer resaleId,
                                                     @PathVariable(name = "butgetid") Integer butgetId) {
        try {
            List<BudgetRequisition> result = this.service.listAllRequisition(companyId, resaleId, butgetId);
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<Object> delete(@RequestBody BudgetRequisitionDto data) {
        try {
            BudgetRequisition requisition = new BudgetRequisition();
            BeanUtils.copyProperties(data, requisition);

            String message = this.service.delete(requisition);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }


}
