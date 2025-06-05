package com.concierge.apiconcierge.validation.clientcompany;

import com.concierge.apiconcierge.models.clientcompany.ClientCompany;
import com.concierge.apiconcierge.models.clientcompany.FisJurEnum;
import com.concierge.apiconcierge.repositories.clientcompany.IClientCompanyRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ClientCompanyValidation implements IClientCompanyValidation {

    @Autowired
    private IClientCompanyRepository repository;

    @Override
    public String save(ClientCompany client) {
        if (client.getCompanyId() == null || client.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (client.getResaleId() == null || client.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (client.getId() == null || client.getId() == 0)
            return ConstantsMessage.ERROR_ID;
        if (client.getStatus() == null)
            return ConstantsMessage.ERROR_STATUS;
        if (client.getName().isBlank())
            return ConstantsMessage.ERROR_NAME;
        if (client.getFisjur() == null)
            return ConstantsMessage.ERROR_TYPE_FISJUS;
        if (client.getFisjur() == FisJurEnum.Física) {
            if (client.getCpf().isBlank())
                return ConstantsMessage.ERROR_CPF;
        } else {
            if (client.getCnpj().isBlank())
                return ConstantsMessage.ERROR_CNPJ;
        }
        if (client.getClifor() == null)
            return ConstantsMessage.ERROR_TYPE_CLIFOR;

        ClientCompany clientResult = this.repository.filterId(client.getCompanyId(), client.getResaleId(), client.getId());
        if (clientResult != null)
            return ConstantsMessage.ERROR_CLIENT_EXISTS;

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String update(ClientCompany client) {

        if (client.getCompanyId() == null || client.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (client.getResaleId() == null || client.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (client.getId() == null || client.getId() == 0)
            return ConstantsMessage.ERROR_ID;
        if (client.getStatus() == null)
            return ConstantsMessage.ERROR_STATUS;
        if (client.getName().isBlank())
            return ConstantsMessage.ERROR_NAME;
        if (client.getFisjur() == null)
            return ConstantsMessage.ERROR_TYPE_FISJUS;
        if (client.getFisjur() == FisJurEnum.Física) {
            if (client.getCpf().isBlank())
                return ConstantsMessage.ERROR_CPF;
        } else {
            if (client.getCnpj().isBlank())
                return ConstantsMessage.ERROR_CNPJ;
        }
        if (client.getClifor() == null)
            return ConstantsMessage.ERROR_TYPE_CLIFOR;

        return ConstantsMessage.SUCCESS;
    }

    public String listAll(Integer companyId, Integer resaleId) {
        if (companyId == null || companyId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (resaleId == null || resaleId == 0)
            return ConstantsMessage.ERROR_COMPANY;

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String filterId(Integer companyId, Integer resaleId, Integer clientId) {
        if (companyId == null || companyId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (resaleId == null || resaleId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (clientId == null || clientId == 0)
            return ConstantsMessage.ERROR_ID;
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String filterJFantasia(String fantasia) {
        if (fantasia.isBlank())
            return ConstantsMessage.ERROR_FANTASIA;
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String filterFFantasia(String fantasia) {
        if (fantasia.isBlank())
            return ConstantsMessage.ERROR_FANTASIA;
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String filterJNome(String name) {
        if (name.isBlank())
            return ConstantsMessage.ERROR_NAME;
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String filterFNome(String name) {
        if (name.isBlank())
            return ConstantsMessage.ERROR_NAME;
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String filterCNPJ(String cnpj) {
        if (cnpj.isBlank())
            return ConstantsMessage.ERROR_CNPJ;
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String filterCPF(String cpf) {
        if (cpf.isBlank())
            return ConstantsMessage.ERROR_CPF;
        return ConstantsMessage.SUCCESS;
    }
}
