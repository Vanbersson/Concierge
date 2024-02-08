package com.concierge.apiconcierge.dtos;

import com.concierge.apiconcierge.models.companies.Company;
import com.concierge.apiconcierge.models.resales.Resale;
import com.concierge.apiconcierge.models.role.UserRole;
import com.concierge.apiconcierge.models.status.StatusEnabledDisabledEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserDto(
        @NotNull Integer resaleId,
        Integer id,
        @NotNull StatusEnabledDisabledEnum status,
        @NotBlank String name,
        @NotBlank String login,
        String password,
        String email,
        String cellphone,
        @NotNull Integer roleId) {
}