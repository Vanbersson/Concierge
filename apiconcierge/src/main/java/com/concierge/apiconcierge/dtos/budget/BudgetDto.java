package com.concierge.apiconcierge.dtos.budget;

import com.concierge.apiconcierge.models.budget.enums.StatusBudgetEnum;
import jakarta.validation.constraints.NotNull;

import java.util.Date;

public record BudgetDto(
        @NotNull Integer companyId,
        @NotNull Integer resaleId,
        @NotNull Integer vehicleEntryId,
        Integer id,
        StatusBudgetEnum status,

        Date dateGeration,
        Date dateAuth) {
}
