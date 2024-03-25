package com.concierge.apiconcierge.repositories.vehicle;

import com.concierge.apiconcierge.models.vehicle.VehicleModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleModelRepository extends JpaRepository<VehicleModel, Integer> {

    List<VehicleModel> findByCompanyIdAndResaleId(Integer companyId, Integer resaleId);

    VehicleModel findByCompanyIdAndResaleIdAndId(Integer companyId, Integer resaleId, Integer id);
}
