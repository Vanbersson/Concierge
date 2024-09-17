package com.concierge.apiconcierge.dtos.permission;

import jakarta.validation.constraints.NotNull;

public record PermissionUserDeleteDto(@NotNull Integer userId) {
}
