package com.concierge.apiconcierge.repositories.vehicle;

import com.concierge.apiconcierge.models.vehicle.VehicleEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleEntryIRepository extends JpaRepository<VehicleEntry, Integer> {
    //
    @Query(
            value = "SELECT `company_id`, `resale_id`, `id`, `status`, `step_entry`, `budget_id`, `budget_status`, `id_user_entry`, `name_user_entry`, `date_entry`, `date_prevision_exit`, `id_user_attendant`, `name_user_attendant`, `id_user_exit_auth1`, `name_user_exit_auth1`, `date_exit_auth1`, `id_user_exit_auth2`, `name_user_exit_auth2`, `date_exit_auth2`, `status_auth_exit`, `model_id`, `model_description`, `client_company_id`, `client_company_name`, `client_company_cnpj`, `client_company_cpf`, `client_company_rg`, `driver_entry_name`, `driver_entry_cpf`, `driver_entry_rg`, `driver_entry_photo`, `driver_entry_signature`, `driver_entry_photo_doc1`, `driver_entry_photo_doc2`, `driver_exit_name`, `driver_exit_cpf`, `driver_exit_rg`, `driver_exit_photo`, `driver_exit_signature`, `driver_exit_photo_doc1`, `driver_exit_photo_doc2`, `color`, `placa`, `frota`, `vehicle_new`, `km_entry`, `km_exit`, `photo1`, `photo2`, `photo3`, `photo4`, `quantity_extinguisher`, `quantity_traffic_cone`, `quantity_tire`, `quantity_tire_complete`, `quantity_tool_box`, `service_order`, `num_service_order`, `num_nfe`, `num_nfse`, `information`, `information_concierge` FROM `tb_vehicle_entry` ",nativeQuery = true)
    List<VehicleEntry> listEntry();

    VehicleEntry findByPlaca(String placa);

    VehicleEntry findByClientCompanyCnpj(String cnpj);

    VehicleEntry findByClientCompanyCpf(String cpf);

}
