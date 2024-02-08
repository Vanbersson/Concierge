package com.concierge.apiconcierge.dtos;

import com.concierge.apiconcierge.models.address.Address;
import com.concierge.apiconcierge.models.companies.Company;
import com.concierge.apiconcierge.models.status.StatusEnabledDisabledEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ResaleDto(
        Integer companyId,
        Integer id,
        StatusEnabledDisabledEnum status,
        @NotBlank String name,
        @NotBlank String cnpj,
        @NotNull Integer addressId
) {
}
