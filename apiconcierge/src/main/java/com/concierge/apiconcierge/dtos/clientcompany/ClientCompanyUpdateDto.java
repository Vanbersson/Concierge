package com.concierge.apiconcierge.dtos.clientcompany;

import com.concierge.apiconcierge.models.clientcompany.CliForEnum;
import com.concierge.apiconcierge.models.clientcompany.FisJurEnum;
import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ClientCompanyUpdateDto(
        @NotNull Integer companyId,
        @NotNull Integer resaleId,
        @NotNull Integer id,
        @NotNull StatusEnableDisable status,
        @NotBlank String name,
        String fantasia,
        @NotNull CliForEnum clifor,
        @NotNull FisJurEnum fisjur,
        String cnpj,
        String cpf,
        String rg,
        String emailHome,
        String emailWork,
        String dddCellphone,
        String cellphone,
        String dddPhone,
        String phone,
        @NotBlank String zipCode,
        @NotBlank String state,
        @NotBlank String city,
        @NotBlank String neighborhood,
        @NotBlank String address,
        @NotBlank String addressNumber,
        String addressComplement
) {
}
