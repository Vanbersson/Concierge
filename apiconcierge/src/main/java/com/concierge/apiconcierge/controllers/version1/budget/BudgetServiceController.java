package com.concierge.apiconcierge.controllers.version1.budget;

import com.concierge.apiconcierge.dtos.budget.BudgetServiceSaveDto;
import com.concierge.apiconcierge.dtos.budget.BudgetServiceUpdateDto;
import com.concierge.apiconcierge.models.budget.BudgetService;
import com.concierge.apiconcierge.repositories.budget.IBudgetService;
import jakarta.validation.Valid;
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
    private IBudgetService service;

    @PostMapping("/save")
    public ResponseEntity<BudgetService> saveService(@RequestBody @Valid BudgetServiceSaveDto data) {
        BudgetService budgetService = new BudgetService();
        BeanUtils.copyProperties(data, budgetService);
        this.service.save(budgetService);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/update")
    public ResponseEntity<Object> updateService(@RequestBody @Valid BudgetServiceUpdateDto data) {
        BudgetService budgetService = new BudgetService();
        BeanUtils.copyProperties(data, budgetService);
        this.service.save(budgetService);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/filter/butget/{butgetid}")
    public ResponseEntity<List<BudgetService>> getServiceId(@PathVariable(name = "butgetid") Integer butget) {
        List<BudgetService> list = this.service.listService(butget);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/delete")
    public ResponseEntity<Object> deleteService(@RequestBody @Valid BudgetServiceUpdateDto data) {
        BudgetService budgetService = new BudgetService();
        BeanUtils.copyProperties(data, budgetService);
        this.service.delete(budgetService);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/delete/all/discount/{butget}")
    public ResponseEntity<Object> deleteAllDiscount(@PathVariable(name = "butget") Integer butget) {
        List<BudgetService> list = this.service.listService(butget);
        for (BudgetService item: list) {
            item.setDiscount(0);
            this.service.save(item);
        }
        return ResponseEntity.ok().build();
    }


}
