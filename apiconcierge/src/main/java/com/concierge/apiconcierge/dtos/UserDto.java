package com.concierge.apiconcierge.dtos;

import com.concierge.apiconcierge.models.role.UserRole;
import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record UserDto(
        @NotNull Integer companyId,
        @NotNull Integer resaleId,
        Integer id,
        StatusEnableDisable status,
        String name,
        String login,
        String password,
        String email,
        String cellphone,
        UUID imageId,
        @NotNull Integer role) {
}
