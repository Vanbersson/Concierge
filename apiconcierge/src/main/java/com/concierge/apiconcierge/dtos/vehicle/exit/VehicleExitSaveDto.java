package com.concierge.apiconcierge.dtos.vehicle.exit;

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
