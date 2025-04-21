package com.concierge.apiconcierge.validation.purchase.item;

import com.concierge.apiconcierge.models.purchase.PurchaseOrder;
import com.concierge.apiconcierge.models.purchase.PurchaseOrderItem;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.stereotype.Service;

@Service
public class PurchaseOrderItemValidation implements IPurchaseOrderItemValidation{
    @Override
    public String save(PurchaseOrderItem item) {
        if (item.getCompanyId() == null || item.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (item.getResaleId() == null || item.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String update(PurchaseOrderItem item) {
        if (item.getCompanyId() == null || item.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (item.getResaleId() == null || item.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if(item.getId() == null)
            return ConstantsMessage.ERROR_ID;

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String delete(PurchaseOrderItem item){
        if (item.getCompanyId() == null || item.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (item.getResaleId() == null || item.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if(item.getId() == null)
            return ConstantsMessage.ERROR_ID;

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String filterId(Integer companyId, Integer resaleId, Integer purchaseId) {
        if (companyId == null || companyId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (resaleId == null || resaleId == 0)
            return ConstantsMessage.ERROR_RESALE;
        if(purchaseId == null || purchaseId == 0)
            return  ConstantsMessage.ERROR_ID;

        return ConstantsMessage.SUCCESS;
    }
}
