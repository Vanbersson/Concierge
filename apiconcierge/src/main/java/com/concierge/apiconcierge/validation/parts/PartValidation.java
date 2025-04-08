package com.concierge.apiconcierge.validation.parts;

import com.concierge.apiconcierge.models.part.Part;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.stereotype.Service;

@Service
public class PartValidation implements IPartValidation {


    @Override
    public String save(Part part) {
        if (part.getCompanyId() == null || part.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (part.getResaleId() == null || part.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (part.getId() == null || part.getId() == 0)
            return ConstantsMessage.ERROR_ID;

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String update(Part part) {
        if (part.getCompanyId() == null || part.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (part.getResaleId() == null || part.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (part.getId() == null || part.getId() == 0)
            return ConstantsMessage.ERROR_ID;

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
}
