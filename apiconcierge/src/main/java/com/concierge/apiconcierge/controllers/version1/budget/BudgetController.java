package com.concierge.apiconcierge.controllers.version1.budget;


import com.concierge.apiconcierge.dtos.budget.BudgetDto;
import com.concierge.apiconcierge.dtos.budget.BudgetNewDto;
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
import java.util.Optional;

@RestController
@RequestMapping("/vehicle/entry/budget")
public class BudgetController {

    @Autowired
    private BudgetIRepository budgetIRepository;
    @Autowired
    private VehicleEntryIRepository vehicleEntryIRepository;

    @PostMapping("/save")
    public ResponseEntity<Object> saveBudget(@RequestBody @Valid BudgetNewDto data) {

        Optional<VehicleEntry> vehicle = this.vehicleEntryIRepository.findById(data.vehicleEntryId());

        VehicleEntry vehicleEntry = vehicle.get();
        if (vehicleEntry.getBudgetId() != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Budget budget = new Budget();
        budget.setCompanyId(vehicleEntry.getCompanyId());
        budget.setResaleId(vehicleEntry.getResaleId());
        budget.setStatus(StatusBudgetEnum.naoEnviado);
        budget.setDateGeration(new Date());
        Budget resultBudget = this.budgetIRepository.save(budget);

        //alterar o status do orçamento na entrada de veículo
        vehicleEntry.setBudgetId(resultBudget.getId());
        vehicleEntry.setBudgetStatus(budget.getStatus());
        this.vehicleEntryIRepository.save(vehicleEntry);

        return ResponseEntity.status(HttpStatus.CREATED).body(resultBudget);
    }

}
