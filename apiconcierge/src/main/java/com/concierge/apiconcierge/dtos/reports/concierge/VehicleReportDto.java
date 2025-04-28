package com.concierge.apiconcierge.dtos.reports.concierge;

import com.concierge.apiconcierge.models.vehicle.enums.VehicleYesNotEnum;

import java.util.Date;

public record VehicleReportDto(
        String type,
        VehicleYesNotEnum vehicleNew,
        Integer companyId,
        Integer resaleId,
        Date dateInit,
        Date dateFinal,
        Integer clientId,
        Integer modelId,
        Integer vehicleId,
        String placa,
        String frota
) {
}
