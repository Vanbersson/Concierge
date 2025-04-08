package com.concierge.apiconcierge.validation.budget.requisition;

import com.concierge.apiconcierge.models.budget.BudgetRequisition;

import java.util.List;

public interface IBudgetRequisitionValidation {
    public String save(BudgetRequisition requisition);

    public String update(BudgetRequisition requisition);

    public String delete(BudgetRequisition requisition);

    public String listAllRequisition(Integer companyId, Integer resaleId, Integer budgetId);
}
