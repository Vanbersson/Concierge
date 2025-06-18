package com.concierge.apiconcierge.validation.workshop.mechanic;

import com.concierge.apiconcierge.models.workshop.mechanic.Mechanic;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.stereotype.Service;

@Service
public class MechanicValidation implements IMechanicValidation {
    @Override
    public String save(Mechanic mec) {
        if (mec.getCompanyId() == null || mec.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (mec.getResaleId() == null || mec.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (mec.getStatus() == null)
            return ConstantsMessage.ERROR_STATUS;
        if (mec.getName().isBlank())
            return ConstantsMessage.ERROR_NAME;
        if (mec.getCodePassword() == null || mec.getCodePassword() == 0)
            return "Password not informed.";

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String update(Mechanic mec) {
        if (mec.getCompanyId() == null || mec.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (mec.getResaleId() == null || mec.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (mec.getId() == null || mec.getId() == 0)
            return ConstantsMessage.ERROR_ID;
        if (mec.getStatus() == null)
            return ConstantsMessage.ERROR_STATUS;
        if (mec.getName().isBlank())
            return ConstantsMessage.ERROR_NAME;
        if (mec.getCodePassword() == null || mec.getCodePassword() == 0)
            return "Password not informed.";

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
    public String filterCodePass(Mechanic mec) {
        if (mec.getCompanyId() == null || mec.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (mec.getResaleId() == null || mec.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (mec.getCodePassword() == null || mec.getCodePassword() == 0)
            return "Password not informed.";

        return ConstantsMessage.SUCCESS;
    }
}
