package com.concierge.apiconcierge.controllers.version1.budget;

import com.concierge.apiconcierge.dtos.budget.BudgetRequisitionSaveDto;
import com.concierge.apiconcierge.dtos.budget.BudgetRequisitionUpdateDto;
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
@RequestMapping("/vehicle/entry/budget/requisition")
public class BudgetRequisitionController {

    @Autowired
    private BudgetRequisitionIRepository requisitionIRepository;

    @PostMapping("/save")
    public ResponseEntity<Object> saveReq(@RequestBody @Valid BudgetRequisitionSaveDto data) {
        BudgetRequisition requisition = new BudgetRequisition();
        BeanUtils.copyProperties(data, requisition);
        requisition.setId(null);
        this.requisitionIRepository.save(requisition);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/update")
    public ResponseEntity<Object> updateReq(@RequestBody @Valid BudgetRequisitionUpdateDto data) {
        BudgetRequisition requisition = new BudgetRequisition();
        BeanUtils.copyProperties(data, requisition);
        this.requisitionIRepository.save(requisition);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/filter/butget/{butgetid}")
    public ResponseEntity<List<BudgetRequisition>> getReqId(@PathVariable(name = "butgetid") Integer butgetId) {
        List<BudgetRequisition> list = this.requisitionIRepository.listRequisition(butgetId);
        return ResponseEntity.ok().body(list);
    }

    @PostMapping("/delete")
    public ResponseEntity<Object> deleteReq(@RequestBody @Valid BudgetRequisitionUpdateDto data) {

        BudgetRequisition requisition = new BudgetRequisition();
        BeanUtils.copyProperties(data, requisition);
        this.requisitionIRepository.delete(requisition);

        return ResponseEntity.ok().build();
    }


}
