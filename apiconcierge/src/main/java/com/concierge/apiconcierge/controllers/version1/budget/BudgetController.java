package com.concierge.apiconcierge.controllers.version1.budget;


import com.concierge.apiconcierge.dtos.budget.BudgetDto;
import com.concierge.apiconcierge.models.budget.Budget;
import com.concierge.apiconcierge.models.budget.enums.StatusBudgetEnum;
import com.concierge.apiconcierge.models.vehicle.VehicleEntry;
import com.concierge.apiconcierge.repositories.budget.BudgetIRepository;
import com.concierge.apiconcierge.repositories.vehicle.VehicleEntryIRepository;
import com.concierge.apiconcierge.repositories.vehicle.VehicleEntryRepository;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController
@RequestMapping("/v1/{companyid}/{resaleid}/budget")
public class BudgetController {


    @Autowired
    private BudgetIRepository budgetIRepository;

    @Autowired
    VehicleEntryIRepository vehicleEntryIRepository;

    @PostMapping("/add")
    public ResponseEntity<Budget> addBudget(@RequestBody @Valid BudgetDto data) {

        VehicleEntry vehicle = vehicleEntryIRepository.findByCompanyIdAndResaleIdAndId(data.companyId(), data.resaleId(), data.vehicleEntryId());

        if(vehicle.getBudgetId() != null){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Budget budget = new Budget();
        BeanUtils.copyProperties(data, budget);

        budget.setStatus(StatusBudgetEnum.naoEnviado);
        budget.setDateGeration(new Date());

        Budget result = budgetIRepository.save(budget);

        //alterar o statu do orçamento na entrada de veículo
        saveBudgetVehicleEntry(result, data.vehicleEntryId());

        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    private void saveBudgetVehicleEntry(Budget budget, Integer id) {

        VehicleEntry v = vehicleEntryIRepository.findByCompanyIdAndResaleIdAndId(budget.getCompanyId(), budget.getResaleId(), id);

        v.setBudgetId(budget.getId());
        v.setBudgetStatus(budget.getStatus());

        vehicleEntryIRepository.save(v);

    }
}
