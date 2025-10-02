package com.concierge.apiconcierge.validation.driver;

import com.concierge.apiconcierge.models.driver.Driver;

public interface IDriverValidation {

    public String save(Driver driver);

    public String update(Driver driver);

    public String listLast100(Integer companyId, Integer resaleId);

    public String filterDriverId(Integer companyId, Integer resaleId, Integer driverId);

    public String filterDriverCPF(Integer companyId, Integer resaleId, String cpf);

    public String filterDriverRG(Integer companyId, Integer resaleId, String rg);
}
