package com.concierge.apiconcierge.validation.clientcompany;

import com.concierge.apiconcierge.models.clientcompany.ClientCompany;
import com.concierge.apiconcierge.models.clientcompany.FisJurEnum;
import org.springframework.stereotype.Service;

@Service
public class ClientCompanyValidation implements IClientCompanyValidation {

    private static final String SUCCESS = "success.";
    private final String COMPANY = "Id not informed.";
    private final String RESALE = "Resale not informed.";
    private final String ID = "Id not informed.";

    private final String CNPJ = "CNPJ not informed.";
    private final String CPF = "CPF not informed.";

    @Override
    public String save(ClientCompany client) {

        if (client.getId() == null || client.getId() == 0)
            return ID;
        if (client.getFisjur() == FisJurEnum.Fisica) {
            if (client.getCpf().isBlank())
                return CPF;
        } else {
            if (client.getCnpj().isBlank())
                return CNPJ;
        }
        return SUCCESS;
    }

    @Override
    public String update(ClientCompany client) {
        if (client.getId() == null || client.getId() == 0)
            return ID;
        if (client.getFisjur() == FisJurEnum.Fisica) {
            if (client.getCpf().isBlank())
                return CPF;

        } else {
            if (client.getCnpj().isBlank())
                return CNPJ;
        }
        return SUCCESS;
    }
}
