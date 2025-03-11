package com.concierge.apiconcierge.controllers.budget;


import com.concierge.apiconcierge.dtos.message.MessageResponseDto;
import com.concierge.apiconcierge.dtos.budget.BudgetDto;
import com.concierge.apiconcierge.dtos.budget.BudgetNewDto;
import com.concierge.apiconcierge.models.budget.Budget;
import com.concierge.apiconcierge.repositories.budget.IBudgetRepository;
import com.concierge.apiconcierge.repositories.vehicle.entry.IVehicleEntryRepository;
import com.concierge.apiconcierge.services.auth.TokenService;
import com.concierge.apiconcierge.services.budget.BudgetService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/vehicle/entry/budget")
public class BudgetController {

    @Autowired
    private BudgetService service;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private IBudgetRepository IBudgetRepository;
    @Autowired
    private IVehicleEntryRepository IVehicleEntryRepository;

    @PostMapping("/save")
    public ResponseEntity<Object> save(@RequestBody BudgetNewDto data, HttpServletRequest request) {
        try {
            String userEmail = this.getEmail(request);

            Integer id = this.service.save(data.vehicleEntryId(), userEmail);
            Map<String, Object> map = new HashMap<>();
            map.put("id", id);
            return ResponseEntity.status(HttpStatus.CREATED).body(map);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @PostMapping("/update")
    public ResponseEntity<Object> updateBudget(@RequestBody BudgetDto data, HttpServletRequest request) {
        try {
            String userEmail = this.getEmail(request);
            Budget budget = new Budget();
            BeanUtils.copyProperties(data, budget);
            boolean result = this.service.update(budget, userEmail);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/filter/vehicle/{id}")
    public ResponseEntity<Object> getVehicleId(@PathVariable(name = "id") Integer vehicleId) {
        try {
            Map<String, Object> budget = this.service.filterVehicleId(vehicleId);
            return ResponseEntity.status(HttpStatus.OK).body(budget);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    private String getEmail(HttpServletRequest request) {
        String token = request.getHeader("Authorization").replace("Bearer ", "");
        return this.tokenService.validToken(token);
    }


}
