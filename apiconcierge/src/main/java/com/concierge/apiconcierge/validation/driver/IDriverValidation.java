package com.concierge.apiconcierge.validation.driver;

import com.concierge.apiconcierge.models.driver.Driver;
import com.concierge.apiconcierge.models.message.MessageResponse;

import java.util.Map;

public interface IDriverValidation {

    public MessageResponse save(Driver driver);

    public MessageResponse update(Driver driver);

    public String listAll(Integer companyId, Integer resaleId);

    public String filterDriverId(Integer companyId, Integer resaleId, Integer driverId);

    public String filterDriverCPF(Integer companyId, Integer resaleId, String cpf);

    public String filterDriverRG(Integer companyId, Integer resaleId, String rg);

    public String filterDriverName(Integer companyId, Integer resaleId, String name);

    public String filterDriverCNHRegister(Integer companyId, Integer resaleId, String cnhRegister);
}
