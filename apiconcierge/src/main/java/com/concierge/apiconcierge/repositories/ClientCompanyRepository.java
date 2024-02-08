package com.concierge.apiconcierge.repositories;

import com.concierge.apiconcierge.models.clientcompany.ClientCompany;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientCompanyRepository extends JpaRepository<ClientCompany, Integer> {

    List<ClientCompany> findByResaleId(Integer resaleId);
    ClientCompany findByResaleIdAndId(Integer resaleId, Integer id);

    ClientCompany findByResaleIdAndCnpj(Integer resaleId, String cnpj);

    ClientCompany findByResaleIdAndRg(Integer resaleId, String rg);

    ClientCompany findByResaleIdAndCpf(Integer resaleId, String cpf);


}
