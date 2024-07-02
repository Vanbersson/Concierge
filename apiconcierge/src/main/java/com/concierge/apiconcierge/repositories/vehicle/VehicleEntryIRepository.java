package com.concierge.apiconcierge.repositories.vehicle;

import com.concierge.apiconcierge.models.vehicle.VehicleEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleEntryIRepository extends JpaRepository<VehicleEntry, Integer> {


    List<VehicleEntry> findByCompanyIdAndResaleId(Integer companyId, Integer resaleId);

    VehicleEntry findByCompanyIdAndResaleIdAndId(Integer companyId, Integer resaleId, Integer id);

    VehicleEntry findByCompanyIdAndResaleIdAndPlaca(Integer companyId, Integer resaleId, String placa);

    VehicleEntry findByCompanyIdAndResaleIdAndClientCompanyCnpj(Integer companyId, Integer resaleId, String cnpj);

    VehicleEntry findByCompanyIdAndResaleIdAndClientCompanyCpf(Integer companyId, Integer resaleId, String cpf);

}
