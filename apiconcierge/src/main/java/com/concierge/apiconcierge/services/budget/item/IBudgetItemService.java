package com.concierge.apiconcierge.services.budget.item;

import com.concierge.apiconcierge.models.budget.BudgetItem;

import java.util.List;

public interface IBudgetItemService {
    public String save(BudgetItem part);
    public String update(BudgetItem part);
    public String delete(BudgetItem part);
    public String deleteAllDiscount(BudgetItem part);
    public List<BudgetItem> listItems(Integer companyId,Integer resaleId,Integer budgetId);
}
