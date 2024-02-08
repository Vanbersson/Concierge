package com.concierge.apiconcierge.dtos;

import com.concierge.apiconcierge.models.companies.Company;
import com.concierge.apiconcierge.models.resales.Resale;
import com.concierge.apiconcierge.models.role.RoleEnum;
import com.concierge.apiconcierge.models.status.StatusEnabledDisabledEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserRoleDto(

        @NotNull Integer resaleId,
        Integer id,
        @NotNull StatusEnabledDisabledEnum status,
        @NotBlank String description,
        @NotNull RoleEnum role) {
}
