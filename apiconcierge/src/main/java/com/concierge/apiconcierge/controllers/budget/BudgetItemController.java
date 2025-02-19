package com.concierge.apiconcierge.controllers.budget;

import com.concierge.apiconcierge.dtos.message.MessageResponseDto;
import com.concierge.apiconcierge.dtos.budget.BudgetItemDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/vehicle/entry/budget/item")
public class BudgetItemController {


    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody BudgetItemDto data) {
        try {


            return ResponseEntity.ok("");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }

    }
}
