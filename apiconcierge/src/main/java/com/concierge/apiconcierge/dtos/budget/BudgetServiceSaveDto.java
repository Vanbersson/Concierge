package com.concierge.apiconcierge.dtos.budget;

import com.concierge.apiconcierge.models.budget.enums.StatusBudgetItemEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record BudgetServiceSaveDto(
        @NotNull Integer companyId,
        @NotNull Integer resaleId,
        @NotNull Integer budgetId,
        StatusBudgetItemEnum status,
        @NotNull Integer ordem,
        @NotBlank String description,
        @NotNull float hourService,
        @NotNull float price,
        @NotNull float discount) {
}
