package com.concierge.apiconcierge.validation.purchase;

import com.concierge.apiconcierge.models.purchase.PurchaseOrder;


public interface IPurchaseOrderValidation {

    public String save(PurchaseOrder purchase);

    public String update(PurchaseOrder purchase);

    public String filterOpen(Integer companyId, Integer resaleId);

    public String filterId(Integer companyId, Integer resaleId, Integer purchaseId);
}
