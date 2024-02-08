package com.concierge.apiconcierge.repositories;

import com.concierge.apiconcierge.models.clientcompany.ClientCompanyType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientCompanyTypeRepository extends JpaRepository<ClientCompanyType,Integer> {
}
