package com.concierge.apiconcierge.services.clientcompany;

import com.concierge.apiconcierge.models.clientcompany.ClientCompany;

import java.util.List;
import java.util.Map;

public interface IClientCompanyService {

    public Integer save(ClientCompany client);

    public String update(ClientCompany client);

    public List<ClientCompany> listAll();

    public ClientCompany filterId(Integer id);

    public List<ClientCompany> filterJFantasia(String fantasia);

    public List<ClientCompany> filterFFantasia(String fantasia);

    public List<ClientCompany> filterJNome(String Nome);

    public List<ClientCompany> filterFNome(String Nome);

    public ClientCompany filterCNPJ(String Cnpj);

    public ClientCompany filterCPF(String Cpf);
}
