package com.concierge.apiconcierge.dtos.budget;

import jakarta.validation.constraints.NotNull;

public record BudgetNewDto(@NotNull Integer vehicleEntryId) {
}
