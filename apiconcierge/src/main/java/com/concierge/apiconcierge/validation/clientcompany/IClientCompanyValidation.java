package com.concierge.apiconcierge.validation.clientcompany;

import com.concierge.apiconcierge.models.clientcompany.ClientCompany;

import java.util.List;

public interface IClientCompanyValidation {
    public String save(ClientCompany client);

    public String update(ClientCompany client);

   public String listAll(Integer companyId,Integer resaleId);

    public String filterId(Integer companyId,Integer resaleId, Integer clientId);

    public String filterJFantasia(String fantasia);

    public String filterFFantasia(String fantasia);

    public String filterJNome(String name);

    public String filterFNome(String name);

    public String filterCNPJ(String cnpj);

    public String filterCPF(String cpf);
}
