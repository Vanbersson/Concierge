package com.concierge.apiconcierge.dtos.vehicle;

import java.util.Date;

public record AuthExitDto(
        Integer companyId,
        Integer resaleId,
        Integer idVehicle,
        Integer idUserExitAuth,
        String nameUserExitAuth,
        Date dateExitAuth) {

}
