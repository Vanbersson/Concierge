package com.concierge.apiconcierge.dtos.clientcompany;

import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ClientCompanyDto(
       @NotNull Integer companyId,
        @NotNull Integer resaleId,
        Integer id,
        StatusEnableDisable status,
        String name,
        String cnpj,
        String cpf,
        String rg,
        String email,

        String phone,

        String cellphone,

        @NotNull Integer typeId

) {
}
