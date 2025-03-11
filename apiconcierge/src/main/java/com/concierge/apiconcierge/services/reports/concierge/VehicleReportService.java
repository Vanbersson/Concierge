package com.concierge.apiconcierge.services.reports.concierge;

import com.concierge.apiconcierge.dtos.reports.concierge.VehicleReportDto;
import com.concierge.apiconcierge.exceptions.vehicle.VehicleEntryException;
import com.concierge.apiconcierge.models.vehicle.VehicleEntry;
import com.concierge.apiconcierge.repositories.vehicle.entry.IVehicleEntryRepository;
import com.concierge.apiconcierge.repositories.vehicle.reports.VehicleReportRepository;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class VehicleReportService implements IVehicleReportService {

    @Autowired
    IVehicleEntryRepository repository;

    @Autowired
    VehicleReportRepository reportRepository;

    @SneakyThrows
    @Override
    public List<Object> filterVehicles(VehicleReportDto vehicle) {
        try {
            List<VehicleEntry> vehicles =   this.reportRepository.filterVehicles(vehicle);

            List<Object> list = new ArrayList();
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm");

            for (VehicleEntry item : vehicles) {
                String placa = "";
                if (!item.getPlaca().isBlank())
                    placa = item.getPlaca().substring(0, 3) + "-" + item.getPlaca().substring(3, 7);

                Map<String, Object> map = new HashMap<>();
                map.put("id", item.getId());
                map.put("placa", placa);
                map.put("frota", item.getFrota());
                map.put("vehicleNew", item.getVehicleNew());
                map.put("modelDescription", item.getModelDescription());
                map.put("dateEntry", dateFormat.format(item.getDateEntry()));
                if (item.getDateExit() != null)
                    map.put("dateExit", dateFormat.format(item.getDateExit()));
                map.put("nameUserAttendant", item.getNameUserAttendant());
                map.put("clientCompanyName", item.getClientCompanyName());
                map.put("budgetStatus", item.getBudgetStatus());
                list.add(map);
            }
            return list;
        } catch (Exception ex) {
            throw new VehicleEntryException(ex.getMessage());
        }

    }

    private String createSql(VehicleReportDto vehicle){

        String sql = "SELECT * FROM tb_vehicle_entry WHERE ";

        if(vehicle.companyId() != null)
            sql +="company_id="+ vehicle.companyId();
        if(vehicle.resaleId() != null)
            sql +=" AND resale_id="+vehicle.resaleId();
        if(vehicle.dateInit() != null)
            sql += " AND date_entry BETWEEN '2025-02-24 00:00:00' AND 2025-03-27 23:59:59";
//        if(vehicle.dateFinal() != null)
//            sql += " OR date_entry BETWEEN " + vehicle.dateFinal() + " AND " + vehicle.dateFinal();

        return sql;

    }
}
