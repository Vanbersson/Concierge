package com.concierge.apiconcierge.validation.workshop.toolcontrol.material;

import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMaterial;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.stereotype.Service;

@Service
public class ToolControlMaterialValidation implements IToolControlMaterialValidation {
    @Override
    public String save(ToolControlMaterial mat) {
        if (mat.getCompanyId() == null || mat.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (mat.getResaleId() == null || mat.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (mat.getStatus() == null)
            return ConstantsMessage.ERROR_STATUS;
        if (mat.getDescription().isBlank())
            return ConstantsMessage.ERROR_NAME;
        if (mat.getCategoryId() == null || mat.getCategoryId() == 0)
            return "Category not informed.";
        if (mat.getQuantityAccountingLoan() < 0.0)
            return "Quantity Accounting Loan not informed.";
        if (mat.getQuantityAvailableLoan() < 0.0)
            return "Quantity Available Loan not informed.";
        if (mat.getQuantityAvailableLoan() > mat.getQuantityAccountingLoan())
            return "Error quantity.";

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String update(ToolControlMaterial mat) {
        if (mat.getCompanyId() == null || mat.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (mat.getResaleId() == null || mat.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (mat.getId() == null || mat.getId() == 0)
            return ConstantsMessage.ERROR_ID;
        if (mat.getStatus() == null)
            return ConstantsMessage.ERROR_STATUS;
        if (mat.getDescription().isBlank())
            return ConstantsMessage.ERROR_NAME;
        if (mat.getCategoryId() == null || mat.getCategoryId() == 0)
            return "Category not informed.";
        if (mat.getQuantityAccountingLoan() < 0.0)
            return "Quantity Accounting not informed.";
        if (mat.getQuantityAvailableLoan() < 0.0)
            return "Quantity Available not informed.";

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
