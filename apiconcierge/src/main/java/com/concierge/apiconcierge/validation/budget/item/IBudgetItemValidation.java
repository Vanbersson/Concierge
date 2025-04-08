package com.concierge.apiconcierge.validation.budget.item;

import com.concierge.apiconcierge.models.budget.BudgetItem;

import java.util.List;

public interface IBudgetItemValidation {

    public String save(BudgetItem part);

    public String update(BudgetItem part);

    public String delete(BudgetItem part);

    public String deleteAllDiscount(BudgetItem part);

    public String listItems(Integer companyId, Integer resaleId, Integer budgetId);
}
