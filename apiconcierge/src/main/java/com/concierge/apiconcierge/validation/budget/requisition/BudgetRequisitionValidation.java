package com.concierge.apiconcierge.validation.budget.requisition;

import com.concierge.apiconcierge.models.budget.BudgetRequisition;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.stereotype.Service;

@Service
public class BudgetRequisitionValidation implements IBudgetRequisitionValidation{
    @Override
    public String save(BudgetRequisition requisition) {
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String update(BudgetRequisition requisition) {
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String delete(BudgetRequisition requisition) {
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String listAllRequisition(Integer companyId, Integer resaleId, Integer budgetId) {
        return ConstantsMessage.SUCCESS;
    }
}
