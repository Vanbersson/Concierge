package com.concierge.apiconcierge.dtos.permission;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record PermissionUserSaveDto(
        Integer companyId,
        Integer resaleId,
        Integer userId,
        Integer permissionId) {
}
