package com.concierge.apiconcierge.services.clientcompany;

import com.concierge.apiconcierge.models.clientcompany.ClientCompany;

import java.util.List;
import java.util.Map;

public interface IClientCompanyService {

    public Integer save(ClientCompany client);
    public boolean update(ClientCompany client);

    public List<ClientCompany> listAllLocal();

    public ClientCompany filterIdLocal(Integer id);

    public ClientCompany filterIdRemote(Integer id);
    public List<Object> filterJFantasia(String fantasia);
    public List<Object> filterJNome(String Nome);
    public List<Object> filterFFantasia(String fantasia);
    public List<Object> filterFNome(String Nome);
    public List<Object> filterCNPJ(String Cnpj);
    public List<Object> filterCPF(String Cpf);
}
