package com.concierge.apiconcierge.repositories.vehicle;

import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import com.concierge.apiconcierge.models.vehicle.VehicleModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleModelIRepository extends JpaRepository<VehicleModel, Integer> {

    @Query(value = "SELECT `company_id`, `resale_id`, `id`, `status`, `description`, `photo` FROM `tb_vehicle_model` WHERE STATUS = 0",nativeQuery = true)
    List<VehicleModel> listAllEnabled();

}
