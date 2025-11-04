package com.concierge.apiconcierge.dtos.notification;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record NotificationUserDto(@NotNull Integer companyId,
                                  @NotNull Integer resaleId,
                                  @NotNull UUID id) {
}
