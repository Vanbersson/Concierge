package com.concierge.apiconcierge.dtos.vehicle;

import com.concierge.apiconcierge.models.budget.enums.StatusBudgetEnum;
import com.concierge.apiconcierge.models.vehicle.enums.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Date;

public record VehicleEntryResponseDto(
        @NotNull Integer companyId,
        @NotNull Integer resaleId,
        @NotNull Integer id,
        String status,
        String stepEntry,
        String budgetStatus,
        @NotNull Integer idUserEntry,
        @NotBlank String nameUserEntry,
        String dateEntry,
        String datePrevisionExit,
        Integer idUserAttendant,
        String nameUserAttendant,
        Integer idUserExitAuth1,
        String nameUserExitAuth1,
        Date dateExitAuth1,
        Integer idUserExitAuth2,
        String nameUserExitAuth2,
        Date dateExitAuth2,
        @NotNull StatusAuthExitEnum statusAuthExit,
        @NotNull Integer modelId,
        @NotBlank String modelDescription,
        @NotNull Integer clientCompanyId,
        @NotBlank String clientCompanyName,
        String clientCompanyCnpj,
        String clientCompanyCpf,
        String clientCompanyRg,
        @NotBlank String driverEntryName,
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
        @NotNull ColorVehicleEnum color,
        String placa,
        String frota,
        @NotNull VehicleYesNotEnum vehicleNew,
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
        @NotNull VehicleYesNotEnum serviceOrder,
        String numServiceOrder,
        String numNfe,
        String numNfse,
        String information,
        String informationConcierge) {
}