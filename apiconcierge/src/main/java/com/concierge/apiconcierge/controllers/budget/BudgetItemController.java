package com.concierge.apiconcierge.controllers.budget;

import com.concierge.apiconcierge.dtos.message.MessageResponseDto;
import com.concierge.apiconcierge.dtos.budget.BudgetItemDto;
import com.concierge.apiconcierge.models.budget.BudgetItem;
import com.concierge.apiconcierge.services.budget.item.BudgetItemService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehicle/entry/budget/item")
public class BudgetItemController {

    @Autowired
    private BudgetItemService service;


    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody BudgetItemDto data) {
        try {
            BudgetItem part = new BudgetItem();
            BeanUtils.copyProperties(data, part);

            String message = this.service.save(part);
            return ResponseEntity.status(HttpStatus.CREATED).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }

    }

    @PostMapping("/update")
    public ResponseEntity<Object> update(@RequestBody BudgetItemDto data) {
        try {


            BudgetItem part = new BudgetItem();
            BeanUtils.copyProperties(data, part);

            String message = this.service.update(part);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }

    }

    @PostMapping("/delete")
    public ResponseEntity<Object> delete(@RequestBody BudgetItemDto data) {
        try {
            BudgetItem part = new BudgetItem();
            BeanUtils.copyProperties(data, part);

            String message = this.service.delete(part);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }

    }

    @PostMapping("/delete/all/discount")
    public ResponseEntity<Object> deleteAllDiscount(@RequestBody BudgetItemDto data) {
        try {
            BudgetItem part = new BudgetItem();
            BeanUtils.copyProperties(data, part);

            String message = this.service.deleteAllDiscount(part);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }

    }
    @GetMapping("/{companyId}/{resaleId}/filter/butget/{butgetId}")
    public ResponseEntity<Object> listItems(@PathVariable(name = "companyId") Integer companyId,
                                          @PathVariable(name = "resaleId") Integer resaleId,
                                          @PathVariable(name = "butgetId") Integer butgetId){
        try{
            List<BudgetItem> list = this.service.listItems(companyId, resaleId, butgetId);
            return ResponseEntity.status(HttpStatus.OK).body(list);
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }
}
