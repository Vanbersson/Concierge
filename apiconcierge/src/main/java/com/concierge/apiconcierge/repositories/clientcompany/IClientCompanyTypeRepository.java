package com.concierge.apiconcierge.repositories.clientcompany;

import com.concierge.apiconcierge.models.clientcompany.ClientCompanyType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IClientCompanyTypeRepository extends JpaRepository<ClientCompanyType,Integer> {

    List<ClientCompanyType> findByCompanyIdAndResaleId(Integer companyId, Integer resaleId);
    ClientCompanyType findByCompanyIdAndResaleIdAndId(Integer companyId,Integer resaleId,Integer id);
}
