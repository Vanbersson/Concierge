package com.concierge.apiconcierge.dtos.vehicle.model;

import com.concierge.apiconcierge.models.status.StatusEnableDisable;

public record VehicleModelDto(
        Integer companyId,
        Integer resaleId,
        Integer id,
        StatusEnableDisable status,
        String description) {
}
