package com.concierge.apiconcierge.services.reports.concierge;

import com.concierge.apiconcierge.dtos.reports.concierge.VehicleReportDto;
import com.concierge.apiconcierge.exceptions.vehicle.VehicleEntryException;
import com.concierge.apiconcierge.models.vehicle.entry.VehicleEntry;
import com.concierge.apiconcierge.repositories.vehicle.entry.IVehicleEntryRepository;
import com.concierge.apiconcierge.repositories.vehicle.reports.VehicleReportRepository;
import com.concierge.apiconcierge.services.vehicle.entry.VehicleEntryService;
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

    @Autowired
    VehicleEntryService service;

    @SneakyThrows
    @Override
    public List<Object> filterVehicles(VehicleReportDto ve) {
        try {
            List<VehicleEntry> vehicles = this.reportRepository.filterVehicles(ve);
            List<Object> list = new ArrayList<>();
            for (VehicleEntry vehicle : vehicles) {
                list.add(this.service.loadObject(vehicle));
            }
            return list;
        } catch (Exception ex) {
            throw new VehicleEntryException(ex.getMessage());
        }
    }

}
