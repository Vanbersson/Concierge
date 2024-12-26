package com.concierge.apiconcierge.dtos.budget;

import com.concierge.apiconcierge.models.budget.enums.StatusBudgetEnum;

public record BudgetItemDto(
        Integer companyId,
        Integer resaleId,
        Integer id,
        StatusBudgetEnum status
) {
}
