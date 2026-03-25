package com.concierge.apiconcierge.validation.purchase;

import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.purchase.PurchaseOrder;


public interface IPurchaseOrderValidation {

    public MessageResponse save(PurchaseOrder purchase);

    public MessageResponse update(PurchaseOrder purchase);

    public MessageResponse filterOpen(Integer companyId, Integer resaleId);

    public MessageResponse filterId(Integer companyId, Integer resaleId, Integer purchaseId);
}
