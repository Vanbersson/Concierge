package com.concierge.apiconcierge.services.budget.requisition;

import com.concierge.apiconcierge.exceptions.budget.BudgetException;
import com.concierge.apiconcierge.models.budget.BudgetRequisition;
import com.concierge.apiconcierge.repositories.budget.IBudgetRequisitionRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.validation.budget.requisition.IBudgetRequisitionValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetRequisitionService implements IBudgetRequisitionService {
    @Autowired
    private IBudgetRequisitionRepository repository;

    @Autowired
    private IBudgetRequisitionValidation validation;

    @SneakyThrows
    @Override
    public String save(BudgetRequisition requisition) {
        try {
            String message = this.validation.save(requisition);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                requisition.setId(null);
                this.repository.save(requisition);
                return ConstantsMessage.SUCCESS;
            } else {
                throw new BudgetException(message);
            }
        } catch (Exception ex) {
            throw new BudgetException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public String update(BudgetRequisition requisition) {
        try {
            String message = this.validation.update(requisition);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                this.repository.save(requisition);
                return ConstantsMessage.SUCCESS;
            } else {
                throw new BudgetException(message);
            }
        } catch (Exception ex) {
            throw new BudgetException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public String delete(BudgetRequisition requisition) {
        try {
            String message = this.validation.delete(requisition);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                this.repository.delete(requisition);
                return ConstantsMessage.SUCCESS;
            } else {
                throw new BudgetException(message);
            }
        } catch (Exception ex) {
            throw new BudgetException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public List<BudgetRequisition> listAllRequisition(Integer companyId, Integer resaleId, Integer budgetId) {
        try {
            String message = this.validation.listAllRequisition(companyId, resaleId, budgetId);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                return this.repository.listAllRequisition(companyId, resaleId, budgetId);
            } else {
                throw new BudgetException(message);
            }
        } catch (Exception ex) {
            throw new BudgetException(ex.getMessage());
        }
    }
}
