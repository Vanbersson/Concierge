package com.concierge.apiconcierge.dtos;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record PermissionUserDto(
        UUID id,

        @NotNull Integer resaleId,

        @NotNull Integer userId,

        @NotNull Integer permissionId) {
}
