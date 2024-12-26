package com.concierge.apiconcierge.validation.clientcompany;

import com.concierge.apiconcierge.models.clientcompany.ClientCompany;

public interface IClientCompanyValidation {
    public String save(ClientCompany client);
    public String update(ClientCompany client);
}
