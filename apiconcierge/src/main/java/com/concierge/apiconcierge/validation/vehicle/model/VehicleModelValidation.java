package com.concierge.apiconcierge.validation.vehicle.model;

import com.concierge.apiconcierge.models.vehicle.model.VehicleModel;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.stereotype.Service;

@Service
public class VehicleModelValidation implements IVehicleModelValidation {
    @Override
    public String save(VehicleModel mod) {
        if (mod.getCompanyId() == null || mod.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (mod.getResaleId() == null || mod.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (mod.getStatus() == null)
            return ConstantsMessage.ERROR_STATUS;
        if (mod.getDescription().isBlank())
            return ConstantsMessage.ERROR_NAME;


        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String update(VehicleModel mod) {
        if (mod.getCompanyId() == null || mod.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (mod.getResaleId() == null || mod.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (mod.getId() == null || mod.getId() == 0)
            return ConstantsMessage.ERROR_ID;
        if (mod.getStatus() == null)
            return ConstantsMessage.ERROR_STATUS;
        if (mod.getDescription().isBlank())
            return ConstantsMessage.ERROR_NAME;
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
    public String listAllEnabled(Integer companyId, Integer resaleId) {
        if (companyId == null || companyId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (resaleId == null || resaleId == 0)
            return ConstantsMessage.ERROR_RESALE;

        return ConstantsMessage.SUCCESS;
    }
}
