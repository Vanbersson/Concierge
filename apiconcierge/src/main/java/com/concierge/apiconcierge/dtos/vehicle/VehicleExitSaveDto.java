package com.concierge.apiconcierge.dtos.vehicle;

import java.util.Date;

public record VehicleExitSaveDto(
        Integer vehicleId,
        Integer userId,
        String userName,
        Date dateExit
        ) {
}
