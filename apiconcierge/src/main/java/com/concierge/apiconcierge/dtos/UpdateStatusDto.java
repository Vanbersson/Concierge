package com.concierge.apiconcierge.dtos;

import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateStatusDto(@NotNull Integer id) {

}
