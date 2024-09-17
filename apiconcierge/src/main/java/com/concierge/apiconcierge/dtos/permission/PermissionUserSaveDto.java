package com.concierge.apiconcierge.dtos.permission;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record PermissionUserSaveDto(
        @NotNull Integer companyId,
        @NotNull Integer resaleId,
        @NotNull Integer userId,
        @NotNull Integer permissionId) {
}
