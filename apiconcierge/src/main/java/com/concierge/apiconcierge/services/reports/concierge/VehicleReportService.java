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
                list.add(this.loadObject(vehicle));
            }
            return list;
        } catch (Exception ex) {
            throw new VehicleEntryException(ex.getMessage());
        }
    }

    private Map<String, Object> loadObject(VehicleEntry vehicle) {
        Map<String, Object> map = new HashMap<>();
        map.put("companyId", vehicle.getCompanyId());
        map.put("resaleId", vehicle.getResaleId());
        map.put("id", vehicle.getId());
        map.put("status", vehicle.getStatus());
        map.put("stepEntry", vehicle.getStepEntry());


//        map.put("idUserEntry", vehicle.getIdUserEntry());
//        map.put("nameUserEntry", vehicle.getNameUserEntry());
//        map.put("dateEntry", vehicle.getDateEntry());
//        map.put("entryPhoto1", vehicle.getEntryPhoto1() == null ? "" : vehicle.getEntryPhoto1());
//        map.put("entryPhoto2", vehicle.getEntryPhoto2() == null ? "" : vehicle.getEntryPhoto2());
//        map.put("entryPhoto3", vehicle.getEntryPhoto3() == null ? "" : vehicle.getEntryPhoto3());
//        map.put("entryPhoto4", vehicle.getEntryPhoto4() == null ? "" : vehicle.getEntryPhoto4());
//        map.put("datePrevisionExit", vehicle.getDatePrevisionExit() == null ? "" : vehicle.getDatePrevisionExit());
//
//        map.put("userIdExit", vehicle.getUserIdExit() == null ? 0 : vehicle.getUserIdExit());
//        map.put("userNameExit", vehicle.getUserNameExit());
//        map.put("dateExit", vehicle.getDateExit() == null ? "" : vehicle.getDateExit());
//        map.put("exitPhoto1", vehicle.getExitPhoto1() == null ? "" : vehicle.getExitPhoto1());
//        map.put("exitPhoto2", vehicle.getExitPhoto2() == null ? "" : vehicle.getExitPhoto2());
//        map.put("exitPhoto3", vehicle.getExitPhoto3() == null ? "" : vehicle.getExitPhoto3());
//        map.put("exitPhoto4", vehicle.getExitPhoto4() == null ? "" : vehicle.getExitPhoto4());
        map.put("exitInformation", vehicle.getExitInformation());

//        map.put("idUserAttendant", vehicle.getIdUserAttendant() == null ? 0 : vehicle.getIdUserAttendant());
//        map.put("nameUserAttendant", vehicle.getNameUserAttendant());
//        map.put("photo1", vehicle.getPhoto1() == null ? "" : vehicle.getPhoto1());
//        map.put("photo2", vehicle.getPhoto2() == null ? "" : vehicle.getPhoto2());
//        map.put("photo3", vehicle.getPhoto3() == null ? "" : vehicle.getPhoto3());
//        map.put("photo4", vehicle.getPhoto4() == null ? "" : vehicle.getPhoto4());

//        map.put("idUserExitAuth1", vehicle.getIdUserExitAuth1() == null ? 0 : vehicle.getIdUserExitAuth1());
//        map.put("nameUserExitAuth1", vehicle.getNameUserExitAuth1());
//        map.put("dateExitAuth1", vehicle.getDateExitAuth1() == null ? "" : vehicle.getDateExitAuth1());
//
//        map.put("idUserExitAuth2", vehicle.getIdUserExitAuth2() == null ? 0 : vehicle.getIdUserExitAuth2());
//        map.put("nameUserExitAuth2", vehicle.getNameUserExitAuth2());
//        map.put("dateExitAuth2", vehicle.getDateExitAuth2() == null ? "" : vehicle.getDateExitAuth2());

        map.put("authExitStatus", vehicle.getAuthExitStatus());
        map.put("modelId", vehicle.getModelId());
        map.put("modelDescription", vehicle.getModelDescription());

        map.put("clientCompanyId", vehicle.getClientCompanyId() == null ? 0 : vehicle.getClientCompanyId());
        map.put("clientCompanyName", vehicle.getClientCompanyName());
//        map.put("clientCompanyCnpj", vehicle.getClientCompanyCnpj());
//        map.put("clientCompanyCpf", vehicle.getClientCompanyCpf());
//        map.put("clientCompanyRg", vehicle.getClientCompanyRg());
//
//        map.put("driverEntryId", vehicle.getDriverEntryId() == null ? 0 : vehicle.getDriverEntryId());
//        map.put("driverEntryName", vehicle.getDriverEntryName());
//        map.put("driverEntryCpf", vehicle.getDriverEntryCpf());
//        map.put("driverEntryRg", vehicle.getDriverEntryRg());
//        map.put("driverEntryPhoto", vehicle.getDriverEntryPhoto() == null ? "" : vehicle.getDriverEntryPhoto());
//        map.put("driverEntrySignature", vehicle.getDriverEntrySignature() == null ? "" : vehicle.getDriverEntrySignature());
//        map.put("driverEntryPhotoDoc1", vehicle.getDriverEntryPhotoDoc1() == null ? "" : vehicle.getDriverEntryPhotoDoc1());
//        map.put("driverEntryPhotoDoc2", vehicle.getDriverEntryPhotoDoc2() == null ? "" : vehicle.getDriverEntryPhotoDoc2());

        map.put("driverExitId", vehicle.getDriverExitId() == null ? 0 : vehicle.getDriverExitId());
        map.put("driverExitName", vehicle.getDriverExitName());

//        map.put("driverExitPhoto", vehicle.getDriverExitPhoto() == null ? "" : vehicle.getDriverExitPhoto());
//        map.put("driverExitSignature", vehicle.getDriverExitSignature() == null ? "" : vehicle.getDriverExitSignature());
//        map.put("driverExitPhotoDoc1", vehicle.getDriverExitPhotoDoc1() == null ? "" : vehicle.getDriverExitPhotoDoc1());
//        map.put("driverExitPhotoDoc2", vehicle.getDriverExitPhotoDoc2() == null ? "" : vehicle.getDriverExitPhotoDoc2());

//        map.put("color", vehicle.getColor());
//        map.put("placa", vehicle.getPlaca());
//        map.put("placasJunto", vehicle.getPlacasJunto());
//        map.put("frota", vehicle.getFrota());
//        map.put("vehicleNew", vehicle.getVehicleNew());
//        map.put("kmEntry", vehicle.getKmEntry());
//        map.put("kmExit", vehicle.getKmExit());
//        map.put("quantityExtinguisher", vehicle.getQuantityExtinguisher());
//        map.put("quantityTrafficCone", vehicle.getQuantityTrafficCone());
//        map.put("quantityTire", vehicle.getQuantityTire());
//        map.put("quantityTireComplete", vehicle.getQuantityTireComplete());
//        map.put("quantityToolBox", vehicle.getQuantityToolBox());
//        map.put("serviceOrder", vehicle.getServiceOrder());
        map.put("numServiceOrder", vehicle.getNumServiceOrder());
        map.put("numNfe", vehicle.getNumNfe());
        map.put("numNfse", vehicle.getNumNfse());
        return map;
    }

}
