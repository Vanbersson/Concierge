package com.concierge.apiconcierge.services.clientcompany;

import com.concierge.apiconcierge.exceptions.clientcompany.ClientCompanyException;
import com.concierge.apiconcierge.models.clientcompany.ClientCompany;
import com.concierge.apiconcierge.models.clientcompany.FisJurEnum;
import com.concierge.apiconcierge.repositories.clientcompany.IClientCompanyRepository;
import com.concierge.apiconcierge.validation.clientcompany.ClientCompanyValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ClientCompanyService implements IClientCompanyService {
    private static final String SUCCESS = "success.";
    @Autowired
    private IClientCompanyRepository repository;

    @Autowired
    private ClientCompanyValidation validation;

    @Autowired
    RestTemplate restTemplate;

    @SneakyThrows
    @Override
    public Integer save(ClientCompany client) {
        ClientCompany result;
        try {
            String message = this.validation.save(client);
            if (message.equals(SUCCESS)) {
                if (client.getFisjur() == FisJurEnum.Fisica) {
                    client.setCnpj("");
                } else {
                    client.setCpf("");
                    client.setRg("");
                }
                result = this.repository.save(client);
            } else {
                throw new ClientCompanyException(message);
            }
        } catch (Exception ex) {
            throw new ClientCompanyException(ex.getMessage());
        }

        return result.getId();
    }

    @SneakyThrows
    @Override
    public boolean update(ClientCompany client) {
        ClientCompany result;
        try {
            String message = this.validation.update(client);
            if (message.equals(SUCCESS)) {
                result = this.repository.save(client);
                return true;
            } else {
                throw new ClientCompanyException(message);
            }
        } catch (Exception ex) {
            throw new ClientCompanyException(ex.getMessage());
        }

    }
    @Override
    public List<ClientCompany> listAllLocal(){
        return  this.repository.findAll();
    }

    @Override
    public ClientCompany filterIdLocal(Integer id) {

        Optional<ClientCompany> client0 = this.repository.findById(id);
        if (client0.isEmpty())
            return null;

        return client0.get();
    }

    @Override
    public ClientCompany filterIdRemote(Integer id) {
        String url = "http://10.0.0.20:8080/api/v1/fatclient/filter/code/" + id;
        ClientCompany[] client = this.restTemplate.getForObject(url, ClientCompany[].class);
        if (client.length == 0)
            return null;
        return client[0];
    }

    @Override
    public List<Object> filterJFantasia(String fantasia) {
        return null;
    }

    @Override
    public List<Object> filterJNome(String Nome) {
        return null;
    }

    @Override
    public List<Object> filterFFantasia(String fantasia) {
        return null;
    }

    @Override
    public List<Object> filterFNome(String Nome) {
        return null;
    }

    @Override
    public List<Object> filterCNPJ(String Cnpj) {
        return null;
    }

    @Override
    public List<Object> filterCPF(String Cpf) {
        return null;
    }
}
