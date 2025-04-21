package com.concierge.apiconcierge.validation.purchase;

import com.concierge.apiconcierge.models.purchase.PurchaseOrder;
import com.concierge.apiconcierge.models.purchase.statusEnum.PurchaseOrderStatus;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.validation.purchase.IPurchaseOrderValidation;
import org.springframework.stereotype.Service;

@Service
public class PurchaseOrderValidation implements IPurchaseOrderValidation {
    @Override
    public String save(PurchaseOrder purchase) {
        if (purchase.getCompanyId() == null || purchase.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (purchase.getResaleId() == null || purchase.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if(purchase.getStatus() == PurchaseOrderStatus.Closed_Purchase_Order)
            return "Purchase order close.";
        if(purchase.getResponsibleId() == null || purchase.getResponsibleId() == 0)
            return ConstantsMessage.ERROR_ATTENDANT;
        if(purchase.getResponsibleName().isBlank())
            return ConstantsMessage.ERROR_ATTENDANT;
        if (purchase.getDateGeneration() == null)
            return "Date generation not informed.";
        if(purchase.getDateDelivery() == null)
            return "Date delivery not informed.";
        if(purchase.getPaymentType().isBlank())
            return "Payment not informed.";
        if (purchase.getClientCompanyId() == null || purchase.getClientCompanyId() == 0)
            return ConstantsMessage.ERROR_CLIENTCOMPANY;
        if (purchase.getClientCompanyName().isBlank())
            return ConstantsMessage.ERROR_CLIENTCOMPANY;

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String update(PurchaseOrder purchase) {
        if (purchase.getCompanyId() == null || purchase.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (purchase.getResaleId() == null || purchase.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (purchase.getId() == null || purchase.getId() == 0)
            return ConstantsMessage.ERROR_ID;
        if(purchase.getStatus() == PurchaseOrderStatus.Closed_Purchase_Order)
            return "Purchase order close.";
        if(purchase.getResponsibleId() == null || purchase.getResponsibleId() == 0)
            return ConstantsMessage.ERROR_ATTENDANT;
        if(purchase.getResponsibleName().isBlank())
            return ConstantsMessage.ERROR_ATTENDANT;
        if (purchase.getDateGeneration() == null)
            return "Date generation not informed.";
        if(purchase.getDateDelivery() == null)
            return "Date delivery not informed.";
        if(purchase.getPaymentType().isBlank())
            return "Payment not informed.";
        if (purchase.getClientCompanyId() == null || purchase.getClientCompanyId() == 0)
            return ConstantsMessage.ERROR_CLIENTCOMPANY;
        if (purchase.getClientCompanyName().isBlank())
            return ConstantsMessage.ERROR_CLIENTCOMPANY;

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String filterOpen(Integer companyId, Integer resaleId) {
        if (companyId == null || companyId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (resaleId == null || resaleId == 0)
            return ConstantsMessage.ERROR_RESALE;

        return ConstantsMessage.SUCCESS;
    }

    public String filterId(Integer companyId, Integer resaleId, Integer purchaseId) {
        if (companyId == null || companyId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (resaleId == null || resaleId == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (purchaseId == null || purchaseId == 0)
            return ConstantsMessage.ERROR_ID;

        return ConstantsMessage.SUCCESS;
    }
}
