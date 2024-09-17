package com.concierge.apiconcierge.dtos.budget;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record BudgetRequisitionUpdateDto(@NotNull Integer companyId,
                                         @NotNull Integer resaleId,
                                         @NotNull UUID id,
                                         @NotNull Integer budgetId,
                                         @NotNull Integer ordem,
                                         @NotBlank String description) {
}
