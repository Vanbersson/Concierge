package com.concierge.apiconcierge.dtos.permission;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PermissionDto(
        @NotNull Integer id,
        @NotBlank String description) {
}
