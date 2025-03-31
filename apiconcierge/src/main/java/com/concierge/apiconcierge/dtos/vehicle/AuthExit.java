package com.concierge.apiconcierge.dtos.vehicle;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Date;

public record AuthExit(
        Integer companyId,
        Integer resaleId,
        Integer idVehicle,
        Integer idUserExitAuth,
        String nameUserExitAuth,
        Date dateExitAuth) {

}
