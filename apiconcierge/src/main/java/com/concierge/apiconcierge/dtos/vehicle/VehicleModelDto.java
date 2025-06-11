package com.concierge.apiconcierge.dtos.vehicle;

import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import jakarta.validation.constraints.NotNull;

public record VehicleModelDto(
        Integer companyId,
        Integer resaleId,
        Integer id,
        StatusEnableDisable status,
        String description,
        byte[] photo) {
}
