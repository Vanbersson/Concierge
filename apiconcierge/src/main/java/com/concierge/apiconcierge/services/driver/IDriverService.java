package com.concierge.apiconcierge.services.driver;

import com.concierge.apiconcierge.models.driver.Driver;

import java.util.List;
import java.util.Map;

public interface IDriverService {
    public Map<String,Object> save(Driver driver);

    public String update(Driver driver);

    public List<Map<String, Object>>  listLast100(Integer companyId, Integer resaleId);

    public Map<String, Object> filterDriverId(Integer companyId, Integer resaleId, Integer driverId);

    public Map<String, Object> filterDriverCPF(Integer companyId, Integer resaleId, String cpf);

    public Map<String, Object> filterDriverRG(Integer companyId, Integer resaleId, String rg);
}
