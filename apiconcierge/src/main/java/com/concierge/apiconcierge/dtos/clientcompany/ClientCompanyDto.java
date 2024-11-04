package com.concierge.apiconcierge.dtos.clientcompany;

import com.concierge.apiconcierge.models.clientcompany.CliForEnum;
import com.concierge.apiconcierge.models.clientcompany.FisJurEnum;
import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ClientCompanyDto(
        Integer companyId,
        Integer resaleId,
        Integer id,
        StatusEnableDisable status,
        String name,
        String fantasia,
        CliForEnum clifor,
        FisJurEnum fisjur,
        String cnpj,
        String cpf,
        String rg,
        String emailHome,
        String emailWork,
        String dddCellphone,
        String cellphone,
        String dddPhone,
        String phone,
        String zipCode,
        String state,
        String city,
        String neighborhood,
        String address,
        String addressNumber,
        String addressComplement,
        String contactName,
        String contactEmail,
        String contactDDDPhone,
        String contactPhone,
        String contactDDDCellphone,
        String contactCellphone
) {
}
