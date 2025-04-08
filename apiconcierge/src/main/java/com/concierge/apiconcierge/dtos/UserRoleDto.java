package com.concierge.apiconcierge.dtos;

import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserRoleDto(

        Integer companyId,
        Integer resaleId,
        Integer id,
        StatusEnableDisable status,
        String description) {
}
