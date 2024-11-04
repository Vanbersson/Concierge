package com.concierge.apiconcierge.controllers.version1.budget;


import ch.qos.logback.core.joran.util.beans.BeanUtil;
import com.concierge.apiconcierge.dtos.MessageErrorDto;
import com.concierge.apiconcierge.dtos.budget.BudgetDto;
import com.concierge.apiconcierge.dtos.budget.BudgetNewDto;
import com.concierge.apiconcierge.exceptions.budget.BudgetException;
import com.concierge.apiconcierge.models.budget.Budget;
import com.concierge.apiconcierge.models.budget.enums.StatusBudgetEnum;
import com.concierge.apiconcierge.models.vehicle.VehicleEntry;
import com.concierge.apiconcierge.repositories.budget.IBudgetRepository;
import com.concierge.apiconcierge.repositories.vehicle.IVehicleEntryRepository;
import com.concierge.apiconcierge.services.budget.BudgetService;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/vehicle/entry/budget")
public class BudgetController {

    @Autowired
    private BudgetService service;

    @Autowired
    private IBudgetRepository IBudgetRepository;
    @Autowired
    private IVehicleEntryRepository IVehicleEntryRepository;

    @PostMapping("/save")
    public ResponseEntity<Object> saveBudget(@RequestBody @Valid BudgetNewDto data) {
        try {
            Integer id = this.service.save(data.vehicleEntryId());
            Map<String, Object> map = new HashMap<>();
            map.put("id", id);
            return ResponseEntity.status(HttpStatus.CREATED).body(map);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageErrorDto(ex.getMessage()));
        }
    }

    @PostMapping("/update")
    public ResponseEntity<Object> updateBudget(@RequestBody @Valid BudgetDto data) {
        try {
            Budget budget = new Budget();
            BeanUtils.copyProperties(data, budget);
            boolean result = this.service.update(budget);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageErrorDto(ex.getMessage()));
        }
    }

    @GetMapping("/filter/vehicle/{id}")
    public ResponseEntity<Object> getVehicleId(@PathVariable(name = "id") Integer vehicleId) {
        try {
            Map<String,Object> budget = this.service.filterVehicleId(vehicleId);
            return ResponseEntity.status(HttpStatus.CREATED).body(budget);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageErrorDto(ex.getMessage()));
        }
    }


}
