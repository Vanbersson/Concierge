package com.concierge.apiconcierge.dtos;

import com.concierge.apiconcierge.models.address.Address;
import com.concierge.apiconcierge.models.status.StatusEnabledDisabledEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CompanyDto(
        Integer id,
        StatusEnabledDisabledEnum status,
        @NotBlank String name,
        @NotBlank String cnpj,
         Integer addressId) {
}
