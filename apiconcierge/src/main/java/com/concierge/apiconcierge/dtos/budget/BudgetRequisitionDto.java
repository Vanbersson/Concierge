package com.concierge.apiconcierge.dtos.budget;

import java.util.UUID;

public record BudgetRequisitionDto(
        Integer companyId,
        Integer resaleId,
        UUID id,
        Integer budgetId,
        Integer ordem,
        String description) {
}
