package com.concierge.apiconcierge.dtos.vehicle;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Date;

public record AuthExit(@NotNull Integer companyId,
                       @NotNull Integer resaleId,
                       @NotNull Integer id,
                       @NotNull Integer idUserExitAuth,
                       @NotBlank String nameUserExitAuth
) {

}
