package com.concierge.apiconcierge.services.clientcompany;

import com.concierge.apiconcierge.exceptions.clientcompany.ClientCompanyException;
import com.concierge.apiconcierge.models.clientcompany.ClientCompany;
import com.concierge.apiconcierge.models.clientcompany.FisJurEnum;
import com.concierge.apiconcierge.repositories.clientcompany.IClientCompanyRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.util.ConstantsUrls;
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
    @Autowired
    private IClientCompanyRepository repository;

    @Autowired
    private ClientCompanyValidation validation;

    @SneakyThrows
    @Override
    public Integer save(ClientCompany client) {
        try {
            String message = this.validation.save(client);
            if (message.equals(ConstantsMessage.SUCCESS)) {
                if (client.getFisjur() == FisJurEnum.Fisica) {
                    client.setCnpj("");
                } else {
                    client.setCpf("");
                    client.setRg("");
                }
                ClientCompany clientResult = this.repository.save(client);
                return clientResult.getId();
            } else {
                throw new ClientCompanyException(message);
            }
        } catch (Exception ex) {
            throw new ClientCompanyException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public String update(ClientCompany client) {
        try {
            String message = this.validation.update(client);
            if (message.equals(ConstantsMessage.SUCCESS)) {
                this.repository.save(client);
                return ConstantsMessage.SUCCESS;
            } else {
                throw new ClientCompanyException(message);
            }
        } catch (Exception ex) {
            throw new ClientCompanyException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public List<ClientCompany> listAll(Integer companyId, Integer resaleId) {
        try {
            String message = this.validation.listAll(companyId, resaleId);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                return this.repository.listAll(companyId, resaleId);
            } else {
                throw new ClientCompanyException(message);
            }
        } catch (Exception ex) {
            throw new ClientCompanyException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public ClientCompany filterId(Integer companyId, Integer resaleId, Integer clientId) {
        try {
            String message = this.validation.filterId(companyId, resaleId, clientId);
            if (ConstantsMessage.SUCCESS.equals(message)) {

                ClientCompany client = this.repository.filterId(companyId, resaleId, clientId);
                if (client == null)
                    throw new ClientCompanyException("Client not found.");

                return client;
            } else {
                throw new ClientCompanyException(message);
            }
        } catch (Exception ex) {
            throw new ClientCompanyException(ex.getMessage());
        }

    }

    @SneakyThrows
    @Override
    public List<ClientCompany> filterJFantasia(String fantasia) {
        return null;
    }

    @Override
    public List<ClientCompany> filterJNome(String Nome) {
        return null;
    }

    @Override
    public List<ClientCompany> filterFFantasia(String fantasia) {
        return null;
    }

    @Override
    public List<ClientCompany> filterFNome(String Nome) {
        return null;
    }

    @Override
    public ClientCompany filterCNPJ(String Cnpj) {
        return null;
    }

    @Override
    public ClientCompany filterCPF(String Cpf) {
        return null;
    }
}
