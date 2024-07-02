package com.concierge.apiconcierge.repositories.vehicle;

import com.concierge.apiconcierge.models.budget.enums.StatusBudgetEnum;
import com.concierge.apiconcierge.models.vehicle.VehicleEntry;
import com.concierge.apiconcierge.models.vehicle.enums.StatusAuthExitEnum;
import com.concierge.apiconcierge.models.vehicle.enums.StatusVehicleEnum;
import com.concierge.apiconcierge.models.vehicle.enums.StepVehicleEnum;
import com.concierge.apiconcierge.models.vehicle.enums.VehicleYesNotEnum;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Repository
public class VehicleEntryRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public List<VehicleEntry> getListEntry(Integer companyId, Integer resaleId) {

        String query = "select " +
                "v.companyId, " +
                "v.resaleId, " +
                "v.id, " +
                "v.status, " +
                "v.stepEntry, " +
                "v.budgetId, " +
                "v.budgetStatus, " +

                "v.idUserEntry, " +
                "v.nameUserEntry, " +
                "v.dateEntry , " +

                "v.idUserAttendant, " +
                "v.nameUserAttendant, " +

                "v.idUserExitAuth1, " +
                "v.idUserExitAuth2, " +

                "v.statusAuthExit, " +

                "v.modelId, " +
                "v.modelDescription, " +

                "v.clientCompanyId, " +
                "v.clientCompanyName, " +

                "v.driverEntryName, " +

                "v.placa, " +
                "v.frota, " +
                "v.vehicleNew, " +

                "v.quantityExtinguisher, " +
                "v.quantityTrafficCone, " +
                "v.quantityTire, " +
                "v.quantityTireComplete, " +
                "v.quantityToolBox, " +
                "v.serviceOrder from VehicleEntry v where v.companyId = :companyId and v.resaleId = :resaleId ";

        TypedQuery<Object[]> typedQuery = entityManager.createQuery(query, Object[].class);

        typedQuery.setParameter("companyId", companyId);
        typedQuery.setParameter("resaleId", resaleId);

        List<VehicleEntry> list = new ArrayList<>();

        List<Object[]> result = typedQuery.getResultList();

        VehicleEntry ve;

        for (Object[] row : result) {

            ve = new VehicleEntry();

            ve.setCompanyId((Integer) row[0]);
            ve.setResaleId((Integer) row[1]);
            ve.setId((Integer) row[2]);
            ve.setStatus((StatusVehicleEnum) row[3]);
            ve.setStepEntry((StepVehicleEnum) row[4]);
            ve.setBudgetId((Integer) row[5]);
            ve.setBudgetStatus((StatusBudgetEnum) row[6]);

            ve.setIdUserEntry((Integer) row[7]);
            ve.setNameUserEntry((String) row[8]);

            ve.setDateEntry((Date) row[9]);

            ve.setIdUserAttendant((Integer) row[10]);
            ve.setNameUserAttendant((String) row[11]);

            ve.setIdUserExitAuth1((Integer) row[12]);
            ve.setIdUserExitAuth2((Integer) row[13]);

            ve.setStatusAuthExit((StatusAuthExitEnum) row[14]);

            ve.setModelId((Integer) row[15]);
            ve.setModelDescription((String) row[16]);

            ve.setClientCompanyId((Integer) row[17]);
            ve.setClientCompanyName((String) row[18]);

            ve.setDriverEntryName((String) row[19]);

            ve.setPlaca((String) row[20]);
            ve.setFrota((String) row[21]);

            ve.setVehicleNew((VehicleYesNotEnum) row[22]);

            ve.setQuantityExtinguisher((Integer) row[23]);
            ve.setQuantityTrafficCone((Integer) row[24]);
            ve.setQuantityTire((Integer) row[25]);
            ve.setQuantityTireComplete((Integer) row[26]);
            ve.setQuantityToolBox((Integer) row[27]);

            ve.setServiceOrder((VehicleYesNotEnum) row[28]);

            list.add(ve);

        }

        return list;

    }

    public String addAuthorizationExit1(){

        String query = "update VehicleEntry " +
                "set idUserExitAuth1 = 0, " +
                "nameUserExitAuth1 = 'nome', " +
                "dateExitAuth1= 'data' where companyId = :companyId and resaleId = :resaleId and id = :id";

      int result =    entityManager.createQuery(query).executeUpdate();



        return "Success.";
    }
}
