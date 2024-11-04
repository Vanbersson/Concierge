package com.concierge.apiconcierge.dtos.vehicle;

import com.concierge.apiconcierge.models.budget.enums.StatusBudgetEnum;
import com.concierge.apiconcierge.models.vehicle.enums.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Date;

public record VehicleEntryUpdateDto(
        Integer companyId,
        Integer resaleId,
        Integer id,
        StatusVehicleEnum status,
        StepVehicleEnum stepEntry,
        StatusBudgetEnum budgetStatus,
        Integer idUserEntry,
        String nameUserEntry,
        Date dateEntry,
        Date datePrevisionExit,
        Integer idUserAttendant,
        String nameUserAttendant,
        Integer idUserExitAuth1,
        String nameUserExitAuth1,
        Date dateExitAuth1,
        Integer idUserExitAuth2,
        String nameUserExitAuth2,
        Date dateExitAuth2,
        StatusAuthExitEnum statusAuthExit,
        Integer modelId,
        String modelDescription,
        Integer clientCompanyId,
        String clientCompanyName,
        String clientCompanyCnpj,
        String clientCompanyCpf,
        String clientCompanyRg,
        String driverEntryName,
        String driverEntryCpf,
        String driverEntryRg,
        byte[] driverEntryPhoto,
        byte[] driverEntrySignature,
        byte[] driverEntryPhotoDoc1,
        byte[] driverEntryPhotoDoc2,
        String driverExitName,
        String driverExitCpf,
        String driverExitRg,
        byte[] driverExitPhoto,
        byte[] driverExitSignature,
        byte[] driverExitPhotoDoc1,
        byte[] driverExitPhotoDoc2,
        ColorVehicleEnum color,
        String placa,
        String frota,
        VehicleYesNotEnum vehicleNew,
        String kmEntry,
        String kmExit,
        byte[] photo1,
        byte[] photo2,
        byte[] photo3,
        byte[] photo4,
        Integer quantityExtinguisher,
        Integer quantityTrafficCone,
        Integer quantityTire,
        Integer quantityTireComplete,
        Integer quantityToolBox,
        VehicleYesNotEnum serviceOrder,
        String numServiceOrder,
        String numNfe,
        String numNfse,
        String information,
        String informationConcierge) {
}
