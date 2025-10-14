package com.concierge.apiconcierge.validation.driver;

import com.concierge.apiconcierge.models.driver.Driver;
import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import com.concierge.apiconcierge.repositories.driver.IDriverRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DriverValidation implements IDriverValidation {

    @Autowired
    IDriverRepository repository;

    @Override
    public String save(Driver driver) {
        if (driver.getCompanyId() == null || driver.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (driver.getResaleId() == null || driver.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (driver.getStatus() == null)
            return ConstantsMessage.ERROR_STATUS;
        if (driver.getName().isBlank())
            return ConstantsMessage.ERROR_NAME;
        if (driver.getCpf().isBlank())
            return ConstantsMessage.ERROR_CPF;
        if (driver.getRg().isBlank())
            return ConstantsMessage.ERROR_RG;

        Driver driver1 = this.repository.filterCPF(driver.getCompanyId(), driver.getResaleId(), driver.getCpf());
        if (driver1 != null)
            return "Driver already exists.";

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String update(Driver driver) {
        if (driver.getCompanyId() == null || driver.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (driver.getResaleId() == null || driver.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (driver.getId() == null || driver.getId() == 0)
            return ConstantsMessage.ERROR_ID;
        if (driver.getStatus() == null)
            return ConstantsMessage.ERROR_STATUS;
        if (driver.getName().isBlank())
            return ConstantsMessage.ERROR_NAME;
        if (driver.getCpf().isBlank())
            return ConstantsMessage.ERROR_CPF;
        if (driver.getRg().isBlank())
            return ConstantsMessage.ERROR_RG;
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String listAll(Integer companyId, Integer resaleId) {
        if (companyId == null || companyId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (resaleId == null || resaleId == 0)
            return ConstantsMessage.ERROR_RESALE;
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String filterDriverId(Integer companyId, Integer resaleId, Integer driverId) {
        if (companyId == null || companyId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (resaleId == null || resaleId == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (driverId == null || driverId == 0)
            return ConstantsMessage.ERROR_ID;
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String filterDriverCPF(Integer companyId, Integer resaleId, String cpf) {
        if (companyId == null || companyId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (resaleId == null || resaleId == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (cpf.isBlank())
            return "CPF not informed.";
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String filterDriverRG(Integer companyId, Integer resaleId, String rg) {
        if (companyId == null || companyId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (resaleId == null || resaleId == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (rg.isBlank())
            return "RG not informed.";
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String filterDriverName(Integer companyId, Integer resaleId, String name) {
        if (companyId == null || companyId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (resaleId == null || resaleId == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (name.isBlank())
            return ConstantsMessage.ERROR_NAME;
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String filterDriverCNHRegister(Integer companyId, Integer resaleId, String cnhRegister) {
        if (companyId == null || companyId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (resaleId == null || resaleId == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (cnhRegister.isBlank())
            return "CNH register not informed.";
        return ConstantsMessage.SUCCESS;
    }
}
