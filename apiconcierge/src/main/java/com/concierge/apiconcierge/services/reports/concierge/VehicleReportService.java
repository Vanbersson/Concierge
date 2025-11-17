package com.concierge.apiconcierge.services.reports.concierge;

import com.concierge.apiconcierge.dtos.reports.concierge.VehicleReportDto;
import com.concierge.apiconcierge.exceptions.vehicle.VehicleEntryException;
import com.concierge.apiconcierge.models.vehicle.entry.VehicleEntry;
import com.concierge.apiconcierge.repositories.vehicle.entry.IVehicleEntryRepository;
import com.concierge.apiconcierge.repositories.vehicle.reports.VehicleReportRepository;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class VehicleReportService implements IVehicleReportService {

    @Autowired
    IVehicleEntryRepository repository;

    @Autowired
    VehicleReportRepository reportRepository;

    @SneakyThrows
    @Override
    public List<Object> filterVehicles(VehicleReportDto ve) {
        try {
            List<VehicleEntry> vehicles = this.reportRepository.filterVehicles(ve);
            List<Object> list = new ArrayList<>();
            for (VehicleEntry vehicle : vehicles) {
                Map<String, Object> map = new HashMap<>();
                map.put("companyId", vehicle.getCompanyId());
                map.put("resaleId", vehicle.getResaleId());
                map.put("id", vehicle.getId());
                map.put("status", vehicle.getStatus());
                map.put("stepEntry", vehicle.getStepEntry());
                map.put("budgetStatus", vehicle.getBudgetStatus());
                map.put("idUserEntry", vehicle.getIdUserEntry());
                map.put("nameUserEntry", vehicle.getNameUserEntry());
                map.put("dateEntry", vehicle.getDateEntry());

                map.put("userIdExit", vehicle.getUserIdExit() == null ? 0 : vehicle.getUserIdExit());
                map.put("userNameExit", vehicle.getUserNameExit());
                map.put("dateExit", vehicle.getDateExit() == null ? "" : vehicle.getDateExit());
                map.put("datePrevisionExit", vehicle.getDatePrevisionExit() == null ? "" : vehicle.getDatePrevisionExit());

                if (vehicle.getIdUserAttendant() == null) {
                    map.put("idUserAttendant", 0);
                } else {
                    map.put("idUserAttendant", vehicle.getIdUserAttendant());
                }
                map.put("nameUserAttendant", vehicle.getNameUserAttendant());
                if (vehicle.getIdUserExitAuth1() == null) {
                    map.put("idUserExitAuth1", 0);
                } else {
                    map.put("idUserExitAuth1", vehicle.getIdUserExitAuth1());
                }
                map.put("nameUserExitAuth1", vehicle.getNameUserExitAuth1());
                if (vehicle.getDateExitAuth1() == null) {
                    map.put("dateExitAuth1", "");
                } else {
                    map.put("dateExitAuth1", vehicle.getDateExitAuth1());
                }
                if (vehicle.getIdUserExitAuth2() == null) {
                    map.put("idUserExitAuth2", 0);
                } else {
                    map.put("idUserExitAuth2", vehicle.getIdUserExitAuth2());
                }
                map.put("nameUserExitAuth2", vehicle.getNameUserExitAuth2());
                if (vehicle.getDateExitAuth2() == null) {
                    map.put("dateExitAuth2", "");
                } else {
                    map.put("dateExitAuth2", vehicle.getDateExitAuth2());
                }
                map.put("statusAuthExit", vehicle.getStatusAuthExit());
                map.put("modelId", vehicle.getModelId());
                map.put("modelDescription", vehicle.getModelDescription());
                if (vehicle.getClientCompanyId() == null) {
                    map.put("clientCompanyId", 0);
                } else {
                    map.put("clientCompanyId", vehicle.getClientCompanyId());
                }
                map.put("clientCompanyName", vehicle.getClientCompanyName());
                map.put("clientCompanyCnpj", vehicle.getClientCompanyCnpj());
                map.put("clientCompanyCpf", vehicle.getClientCompanyCpf());
                map.put("clientCompanyRg", vehicle.getClientCompanyRg());

                if (vehicle.getDriverEntryId() == null) {
                    map.put("driverEntryId", 0);
                } else {
                    map.put("driverEntryId", vehicle.getDriverEntryId());
                }
                map.put("driverEntryName", vehicle.getDriverEntryName());
                map.put("driverEntryCpf", vehicle.getDriverEntryCpf());
                if (vehicle.getDriverEntryRg() == null) {
                    map.put("driverEntryRg", 0);
                } else {
                    map.put("driverEntryRg", vehicle.getDriverEntryRg());
                }
                if (vehicle.getDriverEntryPhoto() == null) {
                    map.put("driverEntryPhoto", "");
                } else {
                    map.put("driverEntryPhoto", vehicle.getDriverEntryPhoto());
                }
                if (vehicle.getDriverEntrySignature() == null) {
                    map.put("driverEntrySignature", "");
                } else {
                    map.put("driverEntrySignature", vehicle.getDriverEntrySignature());
                }
                if (vehicle.getDriverEntryPhotoDoc1() == null) {
                    map.put("driverEntryPhotoDoc1", "");
                } else {
                    map.put("driverEntryPhotoDoc1", vehicle.getDriverEntryPhotoDoc1());
                }
                if (vehicle.getDriverEntryPhotoDoc2() == null) {
                    map.put("driverEntryPhotoDoc2", "");
                } else {
                    map.put("driverEntryPhotoDoc2", vehicle.getDriverEntryPhotoDoc2());
                }

                if (vehicle.getDriverExitId() == null) {
                    map.put("driverExitId", 0);
                } else {
                    map.put("driverExitId", vehicle.getDriverExitId());
                }
                map.put("driverExitName", vehicle.getDriverExitName());
                map.put("driverExitCpf", vehicle.getDriverExitCpf());
                if (vehicle.getDriverExitRg() == null) {
                    map.put("driverExitRg", "");
                } else {
                    map.put("driverExitRg", vehicle.getDriverExitRg());
                }
                if (vehicle.getDriverExitPhoto() == null) {
                    map.put("driverExitPhoto", "");
                } else {
                    map.put("driverExitPhoto", vehicle.getDriverExitPhoto());
                }
                if (vehicle.getDriverExitSignature() == null) {
                    map.put("driverExitSignature", "");
                } else {
                    map.put("driverExitSignature", vehicle.getDriverExitSignature());
                }
                if (vehicle.getDriverExitPhotoDoc1() == null) {
                    map.put("driverExitPhotoDoc1", "");
                } else {
                    map.put("driverExitPhotoDoc1", vehicle.getDriverExitPhotoDoc1());
                }
                if (vehicle.getDriverExitPhotoDoc2() == null) {
                    map.put("driverExitPhotoDoc2", "");
                } else {
                    map.put("driverExitPhotoDoc2", vehicle.getDriverExitPhotoDoc2());
                }
                map.put("color", vehicle.getColor());
                map.put("placa", vehicle.getPlaca());
                map.put("frota", vehicle.getFrota());
                map.put("vehicleNew", vehicle.getVehicleNew());
                map.put("kmEntry", vehicle.getKmEntry());
                map.put("kmExit", vehicle.getKmExit());
                if (vehicle.getPhoto1() == null) {
                    map.put("photo1", "");
                } else {
                    map.put("photo1", vehicle.getPhoto1());
                }
                if (vehicle.getPhoto2() == null) {
                    map.put("photo2", "");
                } else {
                    map.put("photo2", vehicle.getPhoto2());
                }
                if (vehicle.getPhoto3() == null) {
                    map.put("photo3", "");
                } else {
                    map.put("photo3", vehicle.getPhoto3());
                }
                if (vehicle.getPhoto4() == null) {
                    map.put("photo4", "");
                } else {
                    map.put("photo4", vehicle.getPhoto4());
                }
                map.put("quantityExtinguisher", vehicle.getQuantityExtinguisher());
                map.put("quantityTrafficCone", vehicle.getQuantityTrafficCone());
                map.put("quantityTire", vehicle.getQuantityTire());
                map.put("quantityTireComplete", vehicle.getQuantityTireComplete());
                map.put("quantityToolBox", vehicle.getQuantityToolBox());
                map.put("serviceOrder", vehicle.getServiceOrder());
                map.put("numServiceOrder", vehicle.getNumServiceOrder());
                map.put("numNfe", vehicle.getNumNfe());
                map.put("numNfse", vehicle.getNumNfse());
                map.put("information", vehicle.getInformation());
                map.put("informationConcierge", vehicle.getInformationConcierge());

                list.add(map);
            }
            return list;
        } catch (Exception ex) {
            throw new VehicleEntryException(ex.getMessage());
        }
    }

}
