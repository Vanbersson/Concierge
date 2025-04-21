package com.concierge.apiconcierge.validation.purchase.item;

import com.concierge.apiconcierge.models.purchase.PurchaseOrder;
import com.concierge.apiconcierge.models.purchase.PurchaseOrderItem;

public interface IPurchaseOrderItemValidation {
    public String save(PurchaseOrderItem item);

    public String update(PurchaseOrderItem item);

    public String delete(PurchaseOrderItem item);

    public String filterId(Integer companyId, Integer resaleId, Integer purchaseId);
}
