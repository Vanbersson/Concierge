package com.concierge.apiconcierge.dtos;

import com.concierge.apiconcierge.models.clientcompany.ClientCompanyTypeEnum;
import com.concierge.apiconcierge.models.status.StatusEnabledDisabledEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ClientCompanyTypeDto(
        @NotNull Integer resaleId,
        Integer id,
        @NotNull StatusEnabledDisabledEnum status,
        @NotBlank String description,
        @NotNull ClientCompanyTypeEnum type
) {
}
