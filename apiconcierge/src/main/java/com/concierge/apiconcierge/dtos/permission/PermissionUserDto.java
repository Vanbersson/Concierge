package com.concierge.apiconcierge.dtos.permission;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record PermissionUserDto(

        @NotNull Integer companyId,
        @NotNull Integer resaleId,
        @NotNull UUID id,
        @NotNull Integer userId,
        @NotNull Integer permissionId) {
}
