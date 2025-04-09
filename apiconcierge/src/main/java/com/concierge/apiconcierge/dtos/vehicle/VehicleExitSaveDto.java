package com.concierge.apiconcierge.dtos.vehicle;

import java.util.Date;

public record VehicleExitSaveDto(
        Integer companyId,
        Integer resaleId,
        Integer vehicleId,
        Integer userId,
        String userName,
        Date dateExit
        ) {
}
