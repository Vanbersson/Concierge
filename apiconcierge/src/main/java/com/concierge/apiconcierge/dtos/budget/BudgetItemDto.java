package com.concierge.apiconcierge.dtos.budget;

import com.concierge.apiconcierge.models.budget.enums.StatusBudgetItemEnum;

public record BudgetItemDto(
        Integer companyId,
        Integer resaleId,
        Integer id,
        Integer partId,
        Integer budgetId,
        StatusBudgetItemEnum status,
        Integer ordem,
        String code,
        String description,
        float quantity,
        float discount,
        float price
) {
}
