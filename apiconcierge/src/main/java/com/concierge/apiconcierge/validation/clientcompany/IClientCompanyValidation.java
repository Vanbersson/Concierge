package com.concierge.apiconcierge.validation.clientcompany;

import com.concierge.apiconcierge.models.clientcompany.ClientCompany;

import java.util.List;

public interface IClientCompanyValidation {
    public String save(ClientCompany client);

    public String update(ClientCompany client);

    public String filterId(Integer id);

    public String filterJFantasia(String fantasia);

    public String filterFFantasia(String fantasia);

    public String filterJNome(String name);

    public String filterFNome(String name);

    public String filterCNPJ(String cnpj);

    public String filterCPF(String cpf);
}
