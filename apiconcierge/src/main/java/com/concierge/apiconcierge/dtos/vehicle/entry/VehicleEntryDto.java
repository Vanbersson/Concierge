package com.concierge.apiconcierge.dtos.vehicle.entry;

import com.concierge.apiconcierge.models.enums.YesNot;
import com.concierge.apiconcierge.models.vehicle.enums.*;

import java.util.Date;

public record VehicleEntryDto(
        Integer companyId,
        Integer resaleId,
        Integer id,
        StatusVehicleEnum status,
        StepVehicleEnum stepEntry,
        Integer budgetId,

        Integer entryUserId,
        String entryUserName,
        Date entryDate,
        String entryPhoto1Url,
        String entryPhoto2Url,
        String entryPhoto3Url,
        String entryPhoto4Url,
        String entryInformation,

        Date exitDatePrevision,

        Integer exitUserId,
        String exitUserName,
        Date exitDate,
        String exitPhoto1Url,
        String exitPhoto2Url,
        String exitPhoto3Url,
        String exitPhoto4Url,
        String exitInformation,

        Integer attendantUserId,
        String attendantUserName,
        String attendantPhoto1Url,
        String attendantPhoto2Url,
        String attendantPhoto3Url,
        String attendantPhoto4Url,

        StatusAuthExitEnum authExitStatus,

        Integer auth1ExitUserId,
        String auth1ExitUserName,
        Date auth1ExitDate,

        Integer auth2ExitUserId,
        String auth2ExitUserName,
        Date auth2ExitDate,

        Integer modelId,
        String modelDescription,

        Integer clientCompanyId,
        String clientCompanyName,

        Integer driverEntryId,
        String driverEntryName,

        Integer driverExitId,
        String driverExitName,

        String vehiclePlate,
        String vehiclePlateTogether,
        String vehicleFleet,
        ColorVehicleEnum vehicleColor,
        String vehicleKmEntry,
        String vehicleKmExit,
        YesNot vehicleNew,
        YesNot vehicleServiceOrder,

        String numServiceOrder,
        String numNfe,
        String numNfse,

        String checkItem1,
        String checkItem2,
        String checkItem3,
        String checkItem4,
        String checkItem5,
        String checkItem6,
        String checkItem7,
        String checkItem8,
        String checkItem9,
        String checkItem10,
        String checkItem11,
        String checkItem12,
        String checkItem13,
        String checkItem14,
        String checkItem15,
        String checkItem16,
        String checkItem17,
        String checkItem18,
        String checkItem19,
        String checkItem20
) {
}
