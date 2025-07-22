package com.concierge.apiconcierge.validation.workshop.toolcontrol.request;

import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlRequest;
import com.concierge.apiconcierge.models.workshop.toolcontrol.enums.StatusRequest;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.stereotype.Service;

@Service
public class ToolControlRequestValidation implements IToolControlRequestValidation {
    @Override
    public String loanRequest(ToolControlRequest req) {
        if (req.getCompanyId() == null || req.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (req.getResaleId() == null || req.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (req.getUserIdReq() == null || req.getUserIdReq() == 0)
            return ConstantsMessage.ERROR_USER_ID;
        if (req.getStatus() == null || req.getStatus() == StatusRequest.Complete)
            return ConstantsMessage.ERROR_STATUS;
        if(req.getTypeMaterial() == null)
            return "Type material not informed.";
        if (req.getDateReq() == null)
            return "Date request not informed.";
        if (req.getMechanicId() == null || req.getMechanicId() == 0)
            return "Mechanic not informed.";

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String loanReturn(ToolControlRequest req) {
        if (req.getCompanyId() == null || req.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (req.getResaleId() == null || req.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (req.getUserIdReq() == null || req.getUserIdReq() == 0)
            return ConstantsMessage.ERROR_USER_ID;
        if (req.getStatus() == null || req.getStatus() == StatusRequest.Complete)
            return ConstantsMessage.ERROR_STATUS;
        if(req.getTypeMaterial() == null)
            return "Type material not informed.";
        if (req.getDateReq() == null)
            return "Date request not informed.";
        if (req.getMechanicId() == null || req.getMechanicId() == 0)
            return "Mechanic not informed.";

        return ConstantsMessage.SUCCESS;
    }

}
