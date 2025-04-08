package com.concierge.apiconcierge.services.budget.service;

import com.concierge.apiconcierge.models.budget.BudgetService;

import java.util.List;

public interface IBudgetServiceService {
    public String save(BudgetService budgetService);

    public String update(BudgetService budgetService);

    public List<BudgetService> listServices(Integer companyId, Integer resaleId, Integer budgetId);

    public String delete(BudgetService budgetService);

    public String deleteAllDiscount(BudgetService budgetService);
}
