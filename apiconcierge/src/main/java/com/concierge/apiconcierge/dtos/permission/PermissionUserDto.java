package com.concierge.apiconcierge.dtos.permission;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record PermissionUserDto(
        Integer companyId,
        Integer resaleId,
        UUID id,
        Integer userId,
        Integer permissionId) {
}
