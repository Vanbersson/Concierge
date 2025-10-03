package com.concierge.apiconcierge.validation.driver;

import com.concierge.apiconcierge.models.driver.Driver;

import java.util.Map;

public interface IDriverValidation {

    public String save(Driver driver);

    public String update(Driver driver);

    public String listAll(Integer companyId, Integer resaleId);

    public String filterDriverId(Integer companyId, Integer resaleId, Integer driverId);

    public String filterDriverCPF(Integer companyId, Integer resaleId, String cpf);

    public String filterDriverRG(Integer companyId, Integer resaleId, String rg);

    public String filterDriverName(Integer companyId, Integer resaleId, String name);

    public String filterDriverCNHRegister(Integer companyId, Integer resaleId, String cnhRegister);
}
