package com.concierge.apiconcierge.dtos.vehicle;

import jakarta.validation.constraints.NotNull;

public record ExistsPlacaDto(
        Integer companyId,
        Integer resaleId,
        String placa
) {
}
