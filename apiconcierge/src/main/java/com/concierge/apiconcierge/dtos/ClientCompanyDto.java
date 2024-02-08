package com.concierge.apiconcierge.dtos;

import com.concierge.apiconcierge.models.status.StatusEnabledDisabledEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ClientCompanyDto(
        @NotNull Integer resaleId,
        Integer id,
        @NotNull StatusEnabledDisabledEnum status,

        @NotBlank String name,
        String cnpj,
        String cpf,
        String rg,
        String email,

        String phone,

        String cellphone,

        @NotNull Integer typeId,

        @NotNull Integer addressId

) {
}
