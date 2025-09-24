package com.concierge.apiconcierge.repositories.vehicle.reports;

import com.concierge.apiconcierge.dtos.reports.concierge.VehicleReportDto;
import com.concierge.apiconcierge.models.vehicle.entry.VehicleEntry;
import com.concierge.apiconcierge.models.vehicle.enums.VehicleYesNotEnum;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

@Repository
public class VehicleReportRepository {

    @PersistenceContext
    private EntityManager em;

    public List<VehicleEntry> filterVehicles(VehicleReportDto vehicleFilters) {

        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<VehicleEntry> cq = cb.createQuery(VehicleEntry.class);
        Root<VehicleEntry> vehicle = cq.from(VehicleEntry.class);

        LocalDateTime dateInit = null;
        LocalDateTime dateInitStart = null;
        Date initStartDate = null;
        if (vehicleFilters.dateInit() != null) {
            dateInit = vehicleFilters.dateInit().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
            // Criar intervalo de 00:00:00 até 23:59:59
            dateInitStart = dateInit.withHour(0).withMinute(0).withSecond(0).withNano(0);
            // Converter de volta para Date
            initStartDate = Date.from(dateInitStart.atZone(ZoneId.systemDefault()).toInstant());
        }

        LocalDateTime dateFinal = null;
        LocalDateTime datefinalEnd = null;
        Date initEndDate = null;
        if (vehicleFilters.dateFinal() != null) {
            dateFinal = vehicleFilters.dateFinal().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
            // Criar intervalo de 00:00:00 até 23:59:59
            datefinalEnd = dateFinal.withHour(23).withMinute(59).withSecond(59).withNano(0);
            initEndDate = Date.from(datefinalEnd.atZone(ZoneId.systemDefault()).toInstant());
        }

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(vehicle.get("companyId"), vehicleFilters.companyId()));
        predicates.add(cb.equal(vehicle.get("resaleId"), vehicleFilters.resaleId()));

        switch (vehicleFilters.type()) {
            case "E":
                if (vehicleFilters.dateInit() != null)
                    predicates.add(cb.or(cb.between(vehicle.get("dateEntry"), initStartDate, initEndDate)));
                    predicates.add(cb.isNull(vehicle.get("dateExit")));
                break;
            case "S":
                if (vehicleFilters.dateFinal() != null)
                    predicates.add(cb.or(cb.between(vehicle.get("dateExit"), initStartDate, initEndDate)));
                break;
            case "A":
                if (vehicleFilters.dateInit() != null && vehicleFilters.dateFinal() != null) {
                    Predicate dateEntryPredicate = cb.between(vehicle.get("dateEntry"), initStartDate, initEndDate);
                    Predicate dateExitPredicate = cb.between(vehicle.get("dateExit"), initStartDate, initEndDate);
                    predicates.add(cb.or(dateEntryPredicate, cb.or(dateExitPredicate)));
                }
                break;
        }

        if (vehicleFilters.clientId() != null && vehicleFilters.clientId() != 0)
            predicates.add(cb.equal(vehicle.get("clientCompanyId"), vehicleFilters.clientId()));
        if (vehicleFilters.modelId() != null && vehicleFilters.modelId() != 0)
            predicates.add(cb.equal(vehicle.get("modelId"), vehicleFilters.modelId()));
        if(vehicleFilters.vehicleId() != null && vehicleFilters.vehicleId() != 0)
            predicates.add(cb.equal(vehicle.get("id"), vehicleFilters.vehicleId()));
        if(vehicleFilters.placa() != "")
            predicates.add(cb.equal(vehicle.get("placa"), vehicleFilters.placa()));
        if(vehicleFilters.frota() != "")
            predicates.add(cb.equal(vehicle.get("frota"), vehicleFilters.frota()));
        if(vehicleFilters.vehicleNew() == VehicleYesNotEnum.yes)
            predicates.add(cb.equal(vehicle.get("vehicleNew"), vehicleFilters.vehicleNew()));

        cq.where(predicates.toArray(new Predicate[0]));
        return em.createQuery(cq).getResultList();
    }
}
