package com.concierge.apiconcierge.dtos;

import jakarta.validation.constraints.NotBlank;

public record PermissionDto(
        Integer id,
        @NotBlank String description) {
}
