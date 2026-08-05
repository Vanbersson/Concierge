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
    private IVehicleEntryRepository repository;

    @Autowired
    private VehicleReportRepository reportRepository;

    @SneakyThrows
    @Override
    public List<Object> filterVehicles(VehicleReportDto ve) {
        try {
            List<VehicleEntry> vehicles = this.reportRepository.filterVehicles(ve);

            System.out.println(vehicles.size());

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


        map.put("entryUserId", vehicle.getEntryUserId());
        map.put("entryUserName", vehicle.getEntryUserName());
        map.put("entryDate", vehicle.getEntryDate());
//        map.put("entryPhoto1", vehicle.getEntryPhoto1() == null ? "" : vehicle.getEntryPhoto1());
//        map.put("entryPhoto2", vehicle.getEntryPhoto2() == null ? "" : vehicle.getEntryPhoto2());
//        map.put("entryPhoto3", vehicle.getEntryPhoto3() == null ? "" : vehicle.getEntryPhoto3());
//        map.put("entryPhoto4", vehicle.getEntryPhoto4() == null ? "" : vehicle.getEntryPhoto4());
        map.put("exitDatePrevision", vehicle.getExitDatePrevision());

        map.put("exitUserId", vehicle.getExitUserId());
        map.put("exitUserName", vehicle.getExitUserName());
        map.put("exitDate", vehicle.getExitDate());
//        map.put("exitPhoto1", vehicle.getExitPhoto1() == null ? "" : vehicle.getExitPhoto1());
//        map.put("exitPhoto2", vehicle.getExitPhoto2() == null ? "" : vehicle.getExitPhoto2());
//        map.put("exitPhoto3", vehicle.getExitPhoto3() == null ? "" : vehicle.getExitPhoto3());
//        map.put("exitPhoto4", vehicle.getExitPhoto4() == null ? "" : vehicle.getExitPhoto4());
        map.put("exitInformation", vehicle.getExitInformation());

        map.put("attendantUserId", vehicle.getAttendantUserId());
        map.put("attendantUserName", vehicle.getAttendantUserName());
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

        map.put("vehicleColor", vehicle.getVehicleColor());
        map.put("vehiclePlate", vehicle.getVehiclePlate());
        map.put("vehicleFleet", vehicle.getVehicleFleet());
        map.put("vehicleNew", vehicle.getVehicleNew());
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
