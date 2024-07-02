package com.concierge.apiconcierge.repositories.vehicle;

import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import com.concierge.apiconcierge.models.vehicle.VehicleModel;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class VehicleModelRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public List<VehicleModel> listAllEnabled(Integer companyId, Integer resaleId) {

        String query = "select " +
                "m.companyId, " +
                "m.resaleId, " +
                "m.id, " +
                "m.status, " +
                "m.description, " +
                "m.image from VehicleModel m where m.companyId = :companyId and m.resaleId = :resaleId and m.status = :status";

        TypedQuery<Object[]> typedQuery = entityManager.createQuery(query, Object[].class);

        typedQuery.setParameter("companyId", companyId);
        typedQuery.setParameter("resaleId", resaleId);
        typedQuery.setParameter("status", StatusEnableDisable.ativo);

        List<Object[]> result = typedQuery.getResultList();

        List<VehicleModel> models = new ArrayList<>();

        VehicleModel mod;

        for (Object[] row : result) {

            mod = new VehicleModel();

            mod.setCompanyId((Integer) row[0]);
            mod.setResaleId((Integer) row[1]);
            mod.setId((Integer) row[2]);
            mod.setStatus((StatusEnableDisable) row[3]);
            mod.setDescription((String) row[4]);
            mod.setImage((byte[]) row[5]);

            models.add(mod);

        }

        return models;


    }
}
