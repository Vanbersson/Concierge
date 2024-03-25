package com.concierge.apiconcierge.dtos.vehicle;

import com.concierge.apiconcierge.models.vehicle.enums.ColorVehicleEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record VehicleDto(
        @NotNull Integer companyId,
        @NotNull Integer resaleId,

        Integer id,
        @NotBlank String placa,
        String chassi,
        String frota,
        @NotBlank String yearManufacture,
        @NotBlank String yearModel,

        String kmCurrent,

        String kmLast,

        @NotNull ColorVehicleEnum color,

        @NotNull Integer modelId,

        @NotNull Integer ownerId) {
}
