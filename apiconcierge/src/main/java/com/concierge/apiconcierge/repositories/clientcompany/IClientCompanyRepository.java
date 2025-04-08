package com.concierge.apiconcierge.repositories.clientcompany;

import com.concierge.apiconcierge.models.clientcompany.ClientCompany;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IClientCompanyRepository extends JpaRepository<ClientCompany, Integer> {

    @Query(value = "SELECT * FROM `tb_client_company` WHERE company_id=?1 AND resale_id=?2 AND id=?3",
            nativeQuery = true)
    ClientCompany filterId(Integer companyId, Integer resaleId, Integer clientId);

    @Query(value = "SELECT * FROM `tb_client_company` WHERE company_id=?1 AND resale_id=?2",
            nativeQuery = true)
    List<ClientCompany> listAll(Integer companyId, Integer resaleId);

    @Query(value = "SELECT * FROM `tb_client_company` WHERE company_id=0 and fisjur = ?1 and fantasia like %?2%",
            nativeQuery = true)
    List<ClientCompany> findFantasia(Integer fisjur, String fantasia);

    @Query(value = "SELECT * FROM `tb_client_company` WHERE company_id=0 and fisjur = ?1 and name like %?2%",
            nativeQuery = true)
    List<ClientCompany> findName(Integer fisjur, String name);

    ClientCompany findByCnpj(String cnpj);

    ClientCompany findByCpf(String cpf);


}
