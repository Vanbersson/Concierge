package com.concierge.apiconcierge.repositories.clientcompany;

import com.concierge.apiconcierge.models.clientcompany.ClientCompany;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientCompanyIRepository extends JpaRepository<ClientCompany, Integer> {

    List<ClientCompany> findByCompanyIdAndResaleId(Integer companyId,Integer resaleId);

    ClientCompany findByCompanyIdAndResaleIdAndId(Integer companyId,Integer resaleId,Integer id);

    ClientCompany findByCompanyIdAndResaleIdAndCnpj(Integer companyId,Integer resaleId,String cnpj);

    ClientCompany findByCompanyIdAndResaleIdAndRg(Integer companyId,Integer resaleId,String rg);

    ClientCompany findByCompanyIdAndResaleIdAndCpf(Integer companyId,Integer resaleId,String cpf);


}
