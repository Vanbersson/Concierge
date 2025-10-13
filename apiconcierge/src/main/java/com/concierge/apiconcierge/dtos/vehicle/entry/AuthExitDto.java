package com.concierge.apiconcierge.dtos.vehicle.entry;

import java.util.Date;

public record AuthExitDto(
        Integer companyId,
        Integer resaleId,
        Integer vehicleId,
        Integer userId,
        String userName,
        Date dateAuth) {

}
