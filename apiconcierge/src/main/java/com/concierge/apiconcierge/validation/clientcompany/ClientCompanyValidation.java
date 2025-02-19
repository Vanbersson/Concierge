package com.concierge.apiconcierge.validation.clientcompany;

import com.concierge.apiconcierge.models.clientcompany.ClientCompany;
import com.concierge.apiconcierge.models.clientcompany.FisJurEnum;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.stereotype.Service;

@Service
public class ClientCompanyValidation implements IClientCompanyValidation {

    @Override
    public String save(ClientCompany client) {
        if (client.getCompanyId() == null || client.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (client.getResaleId() == null || client.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (client.getId() == null || client.getId() == 0)
            return ConstantsMessage.ERROR_ID;

        if (client.getFisjur() == FisJurEnum.Fisica) {
            if (client.getCpf().isBlank())
                return ConstantsMessage.ERROR_CPF;
        } else {
            if (client.getCnpj().isBlank())
                return ConstantsMessage.ERROR_CNPJ;
        }
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

        if (client.getFisjur() == FisJurEnum.Fisica) {
            if (client.getCpf().isBlank())
                return ConstantsMessage.ERROR_CPF;
        } else {
            if (client.getCnpj().isBlank())
                return ConstantsMessage.ERROR_CNPJ;
        }
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String filterId(Integer id) {
        if (id == null || id == 0)
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
