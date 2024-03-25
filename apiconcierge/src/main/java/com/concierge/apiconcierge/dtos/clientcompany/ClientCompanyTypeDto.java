package com.concierge.apiconcierge.dtos.clientcompany;

import com.concierge.apiconcierge.models.clientcompany.ClientCompanyTypeEnum;
import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ClientCompanyTypeDto(
        @NotNull Integer companyId,
        @NotNull Integer resaleId,
        Integer id,
        @NotNull StatusEnableDisable status,
        @NotBlank String description,
        @NotNull ClientCompanyTypeEnum type
) {
}
