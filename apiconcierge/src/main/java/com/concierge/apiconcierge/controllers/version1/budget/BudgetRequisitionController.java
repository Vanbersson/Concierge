package com.concierge.apiconcierge.controllers.version1.budget;

import com.concierge.apiconcierge.dtos.budget.BudgetDto;
import com.concierge.apiconcierge.dtos.budget.BudgetRequisitionDto;
import com.concierge.apiconcierge.models.budget.Budget;
import com.concierge.apiconcierge.models.budget.BudgetRequisition;
import com.concierge.apiconcierge.repositories.budget.BudgetRequisitionIRepository;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/{companyid}/{resaleid}/budget/requisition")
public class BudgetRequisitionController {

    @Autowired
    BudgetRequisitionIRepository requisitionIRepository;

    @PostMapping("/add")
    public ResponseEntity<BudgetRequisition> addRequisition(@RequestBody @Valid BudgetRequisitionDto data) {
        BudgetRequisition requisition = new BudgetRequisition();
        BeanUtils.copyProperties(data, requisition);

        return ResponseEntity.status(HttpStatus.CREATED).body(requisitionIRepository.save(requisition));
    }

    @GetMapping("/list/{butget}")
    public ResponseEntity<List<BudgetRequisition>> listRequisition(
            @PathVariable(name = "companyid") Integer companyid,
            @PathVariable(name = "resaleid") Integer resaleid,
            @PathVariable(name = "butget") Integer butget) {

        return ResponseEntity.ok(requisitionIRepository.listRequisition(companyid, resaleid, butget));

    }

    @PostMapping("/delete")
    public ResponseEntity<BudgetRequisition> addDelete(@RequestBody @Valid BudgetRequisitionDto data) {

        requisitionIRepository.deleteRequisition(data.companyId(), data.resaleId(), data.budgetId(), data.ordem());

       // requisitionIRepository.deleteById(data.id());

        return ResponseEntity.status(HttpStatus.OK).build();
    }




}
