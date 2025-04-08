package com.concierge.apiconcierge.services.budget.requisition;

import com.concierge.apiconcierge.models.budget.BudgetRequisition;

import java.util.List;

public interface IBudgetRequisitionService {
    public String save(BudgetRequisition requisition);

    public String update(BudgetRequisition requisition);

    public String delete(BudgetRequisition requisition);

    public List<BudgetRequisition> listAllRequisition(Integer companyId, Integer resaleId, Integer budgetId);
}
