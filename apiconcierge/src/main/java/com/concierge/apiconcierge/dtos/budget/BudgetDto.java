package com.concierge.apiconcierge.dtos.budget;

import com.concierge.apiconcierge.models.budget.enums.StatusBudgetEnum;
import jakarta.validation.constraints.NotNull;

import java.util.Date;

public record BudgetDto(
        Integer companyId,
        Integer resaleId,
        Integer id,
        StatusBudgetEnum status,
        Date dateGeration,
        Date dateAuth) {
}
