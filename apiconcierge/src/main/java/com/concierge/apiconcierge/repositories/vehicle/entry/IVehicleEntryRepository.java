package com.concierge.apiconcierge.repositories.vehicle.entry;

import com.concierge.apiconcierge.models.vehicle.VehicleEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IVehicleEntryRepository extends JpaRepository<VehicleEntry, Integer> {

    VehicleEntry findByPlaca(String placa);

    @Query(value ="SELECT * FROM `tb_vehicle_entry` WHERE company_id = ?1 and resale_id = ?2 and status = 0 and placa = ?3" ,nativeQuery = true)
    VehicleEntry findByExistsPlaca(Integer companyId,Integer resaleId, String placa);

    VehicleEntry findByClientCompanyCnpj(String cnpj);

    VehicleEntry findByClientCompanyCpf(String cpf);

    @Query(value ="select * from tb_vehicle_entry where status_auth_exit = 2 and step_entry != 4;" ,nativeQuery = true)
    List<VehicleEntry> allAuthorized();
    @Query(value ="select * from tb_vehicle_entry where step_entry != 4" ,nativeQuery = true)
    List<VehicleEntry> allPendingAuthorization();

}
