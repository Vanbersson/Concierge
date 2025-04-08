package com.concierge.apiconcierge.validation.budget.service;

import com.concierge.apiconcierge.models.budget.BudgetService;

import java.util.List;

public interface IBudgetServiceValidation {
    public String save(BudgetService budgetService);

    public String update(BudgetService budgetService);

    public String listServices(Integer companyId, Integer resaleId, Integer budgetId);

    public String delete(BudgetService budgetService);

    public String deleteAllDiscount(BudgetService budgetService);
}
