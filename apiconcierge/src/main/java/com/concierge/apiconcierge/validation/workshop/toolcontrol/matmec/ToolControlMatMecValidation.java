package com.concierge.apiconcierge.validation.workshop.toolcontrol.matmec;

import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMatMec;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ToolControlMatMecValidation implements IToolControlMatMecValidation {
    @Override
    public String save(ToolControlMatMec matMec) {
        if (matMec.getCompanyId() == null || matMec.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (matMec.getResaleId() == null || matMec.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (matMec.getRequestId() == null || matMec.getRequestId() == 0)
            return "Id Request not informed.";
        if (matMec.getDeliveryDate() == null)
            return "Date not informed.";
        if (matMec.getDeliveryQuantity() < 0 || matMec.getDeliveryQuantity() == 0)
            return "Quantity not informed.";
        if (matMec.getMaterialId() == null || matMec.getMaterialId() == 0)
            return "Id Material not informed.";

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String update(ToolControlMatMec matMec) {
        if (matMec.getCompanyId() == null || matMec.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (matMec.getResaleId() == null || matMec.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (matMec.getId() == null)
            return ConstantsMessage.ERROR_ID;
        if (matMec.getRequestId() == null || matMec.getRequestId() == 0)
            return "Id Request not informed.";
        if (matMec.getDeliveryDate() == null)
            return "Date not informed.";
        if (matMec.getDeliveryQuantity() < 0 || matMec.getDeliveryQuantity() == 0)
            return "Quantity not informed.";
        if (matMec.getMaterialId() == null || matMec.getMaterialId() == 0)
            return "Id Material not informed.";

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String filterId(Integer companyId, Integer resaleId, UUID id) {
        if (companyId == null || companyId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (resaleId == null || resaleId == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (id == null)
            return "Id not informed.";
        return ConstantsMessage.SUCCESS;
    }

    public String filterRequestId(Integer companyId, Integer resaleId, Integer requestId) {
        if (companyId == null || companyId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (resaleId == null || resaleId == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (requestId == null)
            return "Request not informed.";

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String filterMatIdDevPend(Integer companyId, Integer resaleId, Integer materialId) {
        if (companyId == null || companyId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (resaleId == null || resaleId == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (materialId == null || materialId == 0)
            return "Id material not informed.";
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String filterMecIdDevPend(Integer companyId, Integer resaleId, Integer mechanicId) {
        if (companyId == null || companyId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (resaleId == null || resaleId == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (mechanicId == null || mechanicId == 0)
            return "Id mechanic not informed.";

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String listAll(Integer companyId, Integer resaleId) {
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String listAllDevPend(Integer companyId, Integer resaleId) {
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String listAllDevComp(Integer companyId, Integer resaleId) {
        return ConstantsMessage.SUCCESS;
    }
}
